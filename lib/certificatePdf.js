import { CHURCH_NAME, APP_NAME } from './constants';
import { createCertificatePdf } from './simplePdf';

export async function certificatePdf({ record, certificateId }) {
  return createCertificatePdf({ record, certificateId, churchName: CHURCH_NAME, appName: APP_NAME });
}
