const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 42;
const BOTTOM_MARGIN = 42;
const DEFAULT_FONT_SIZE = 10;

function normalizeText(value) {
  return String(value ?? '')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, '')
    .trim();
}

function escapePdfText(value) {
  return normalizeText(value).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function rgb(hex) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  return `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)}`;
}

function wrapText(text, maxChars) {
  const words = normalizeText(text).split(' ').filter(Boolean);
  const lines = [];
  let current = '';

  for (const word of words) {
    if (!current) {
      current = word;
    } else if ((current.length + word.length + 1) <= maxChars) {
      current += ` ${word}`;
    } else {
      lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);
  return lines.length ? lines : [''];
}

class PdfBuilder {
  constructor() {
    this.pages = [];
    this.current = null;
    this.y = PAGE_HEIGHT - MARGIN;
  }

  beginPage() {
    this.current = [];
    this.pages.push(this.current);
    this.y = PAGE_HEIGHT - MARGIN;
  }

  ensurePage(requiredHeight = 16) {
    if (!this.current) this.beginPage();
    if (this.y - requiredHeight < BOTTOM_MARGIN) this.beginPage();
  }

  drawText(text, options = {}) {
    const {
      x = MARGIN,
      size = DEFAULT_FONT_SIZE,
      color = '#111827',
      font = 'F1',
      align = 'left',
      width = PAGE_WIDTH - (MARGIN * 2),
      lineGap = 3,
      maxChars,
      y
    } = options;

    const chars = maxChars || Math.max(16, Math.floor(width / (size * 0.48)));
    const lines = wrapText(text, chars);
    const lineHeight = size + lineGap;
    this.ensurePage(lines.length * lineHeight + 2);
    let lineY = typeof y === 'number' ? y : this.y;

    for (const line of lines) {
      const estimatedWidth = line.length * size * 0.48;
      let lineX = x;
      if (align === 'center') lineX = x + Math.max(0, (width - estimatedWidth) / 2);
      if (align === 'right') lineX = x + Math.max(0, width - estimatedWidth);
      this.current.push(`BT /${font} ${size} Tf ${rgb(color)} rg 1 0 0 1 ${lineX.toFixed(2)} ${lineY.toFixed(2)} Tm (${escapePdfText(line)}) Tj ET`);
      lineY -= lineHeight;
    }

    if (typeof y !== 'number') this.y = lineY;
    return lineY;
  }

  moveDown(points = 12) {
    this.y -= points;
    if (this.y < BOTTOM_MARGIN) this.beginPage();
  }

  line(x1, y1, x2, y2, color = '#111827', width = 1) {
    this.ensurePage(1);
    this.current.push(`q ${rgb(color)} RG ${width} w ${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S Q`);
  }

  rect(x, y, width, height, color = '#111827', lineWidth = 1) {
    this.ensurePage(1);
    this.current.push(`q ${rgb(color)} RG ${lineWidth} w ${x.toFixed(2)} ${y.toFixed(2)} ${width.toFixed(2)} ${height.toFixed(2)} re S Q`);
  }

  filledRect(x, y, width, height, color = '#111827') {
    this.ensurePage(1);
    this.current.push(`q ${rgb(color)} rg ${x.toFixed(2)} ${y.toFixed(2)} ${width.toFixed(2)} ${height.toFixed(2)} re f Q`);
  }

  toBuffer() {
    if (!this.pages.length) this.beginPage();

    const objects = [];
    const addObject = content => {
      objects.push(content);
      return objects.length;
    };

    const catalogId = addObject('');
    const pagesId = addObject('');
    const fontRegularId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
    const fontBoldId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');

    const pageIds = [];
    for (const pageCommands of this.pages) {
      const stream = `${pageCommands.join('\n')}\n`;
      const contentId = addObject(`<< /Length ${Buffer.byteLength(stream, 'latin1')} >>\nstream\n${stream}endstream`);
      const pageId = addObject(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 ${fontRegularId} 0 R /F2 ${fontBoldId} 0 R >> >> /Contents ${contentId} 0 R >>`);
      pageIds.push(pageId);
    }

    objects[catalogId - 1] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
    objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds.map(id => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`;

    let pdf = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
    const offsets = [0];
    objects.forEach((content, index) => {
      offsets.push(Buffer.byteLength(pdf, 'latin1'));
      pdf += `${index + 1} 0 obj\n${content}\nendobj\n`;
    });

    const xrefOffset = Buffer.byteLength(pdf, 'latin1');
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    for (let i = 1; i < offsets.length; i += 1) {
      pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
    }
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
    return Buffer.from(pdf, 'latin1');
  }
}

export function createReportPdf({ title, churchName, appName, rows, columns = null }) {
  const keys = columns?.length ? columns : (rows[0] ? Object.keys(rows[0]) : ['Information']);
  const pdf = new PdfBuilder();
  pdf.beginPage();
  pdf.drawText(churchName, { size: 18, color: '#4d0f68', font: 'F2', align: 'center' });
  pdf.drawText(appName, { size: 10, color: '#ad7604', font: 'F2', align: 'center' });
  pdf.moveDown(10);
  pdf.drawText(title, { size: 15, color: '#3a0c4d', font: 'F2' });
  pdf.line(MARGIN, pdf.y - 2, PAGE_WIDTH - MARGIN, pdf.y - 2, '#ad7604', 1);
  pdf.moveDown(12);

  if (!rows.length) {
    pdf.drawText('No records available.', { size: 10 });
  } else {
    rows.forEach((row, index) => {
      pdf.ensurePage(40);
      pdf.drawText(`${index + 1}.`, { size: 10, color: '#4d0f68', font: 'F2' });
      keys.forEach(key => {
        pdf.drawText(`${key}: ${row[key] ?? ''}`, { size: 8.5, maxChars: 105 });
      });
      pdf.moveDown(7);
    });
  }

  return pdf.toBuffer();
}

export function createCertificatePdf({ record, certificateId, churchName, appName }) {
  const pdf = new PdfBuilder();
  pdf.beginPage();
  pdf.rect(22, 22, PAGE_WIDTH - 44, PAGE_HEIGHT - 44, '#ad7604', 2);
  pdf.rect(30, 30, PAGE_WIDTH - 60, PAGE_HEIGHT - 60, '#4d0f68', 1);
  pdf.filledRect(238, 735, 120, 38, '#4d0f68');
  pdf.drawText('TEA', { x: 238, y: 748, width: 120, size: 20, color: '#ffffff', font: 'F2', align: 'center' });
  pdf.y = 700;
  pdf.drawText(churchName, { size: 22, color: '#4d0f68', font: 'F2', align: 'center' });
  pdf.drawText(appName, { size: 12, color: '#ad7604', font: 'F2', align: 'center' });
  pdf.moveDown(24);
  pdf.drawText('Completion Letter', { size: 24, color: '#3a0c4d', font: 'F2', align: 'center' });
  pdf.moveDown(22);

  const student = record.member?.fullName || 'Student';
  const typeCode = record.trainingType?.shortCode || '';
  const wording = ['BT', 'DT'].includes(typeCode)
    ? 'has completed the entry training requirements and is eligible to move forward to the next training path.'
    : 'has completed the required worker training and is recognized for ministry service preparation.';

  pdf.drawText(`This confirms that ${student} of ${record.branch?.name || 'The Edifying Assembly'} ${wording}`, {
    x: 90,
    width: PAGE_WIDTH - 180,
    size: 13,
    align: 'center',
    lineGap: 7,
    maxChars: 72
  });
  pdf.moveDown(22);
  pdf.drawText(`Training Type: ${record.trainingType?.name || ''}`, { size: 11, align: 'center' });
  pdf.drawText(`Training Level: ${record.trainingLevel?.name || ''}`, { size: 11, align: 'center' });
  pdf.drawText(`Exams Passed: ${record.passedExamsCount ?? 0}`, { size: 11, align: 'center' });
  pdf.drawText(`Completion Date: ${new Date().toLocaleDateString()}`, { size: 11, align: 'center' });
  pdf.drawText(`Letter ID: ${certificateId}`, { size: 11, align: 'center' });
  pdf.moveDown(70);
  pdf.drawText('Authorized Signatory: ______________________________', { size: 11, align: 'center' });
  return pdf.toBuffer();
}
