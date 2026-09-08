/**
 * Periyakottai Digital Seva - Official 1-Page Document & Receipt Printer
 * Generates isolated single-page A4 PDF documents for:
 * 1. Citizen Service Request Receipts (printAcknowledgmentReceipt)
 * 2. Official Civic Grievance Forwarding Memos for Department Action (printOfficialGrievancePdf)
 * 3. Structured Official WhatsApp Forwarding URL for Operator (generateOfficialForwardingWhatsAppUrl)
 */

import { GrievanceTicket } from '@/types';

export interface ReceiptData {
  id: string;
  citizenName: string;
  phoneNumber: string;
  serviceName: string;
  village?: string;
  createdAt: string | Date;
  status: string;
  priority?: string;
  description?: string;
}

export const GRIEVANCE_DEPARTMENT_MAP: Record<string, { en: string; ta: string }> = {
  water: { en: 'Panchayat Drinking Water Supply Wing', ta: 'ஊராட்சி குடிநீர் வழங்கல் பிரிவு' },
  street_light: { en: 'TNEB & Panchayat Electrical Section', ta: 'மின்வாரியம் & பஞ்சாயத்து மின் பிரிவு' },
  drainage: { en: 'Rural Sanitation & Drainage Wing', ta: 'சாக்கடை & சுகாதாரப் பிரிவு' },
  road: { en: 'Rural Development & Panchayat Roads Dept', ta: 'ஊரக வளர்ச்சி & நெடுஞ்சாலைத் துறை' },
  garbage: { en: 'Solid Waste Management Division', ta: 'திடக்கழிவு மேலாண்மைப் பிரிவு' },
  health: { en: 'Public Health Centre & Vector Sanitation', ta: 'ஆரம்ப சுகாதார நிலையம் & சுகாதாரப் பிரிவு' },
  ration: { en: 'Civil Supplies & PDS Department', ta: 'குடிமைப் பொருள் வழங்கல் துறை' },
  agriculture: { en: 'Agriculture & Irrigation Department', ta: 'வேளாண்மை & பாசனத் துறை' },
  revenue: { en: 'Revenue Dept (VAO / RI / Tahsildar)', ta: 'வருவாய்த்துறை (கிராம நிர்வாக அலுவலர்)' },
  school: { en: 'School Infrastructure & Anganwadi Wing', ta: 'பள்ளிக் கல்வி & அங்கன்வாடி துறை' },
  animals: { en: 'Veterinary & Animal Welfare Dept', ta: 'கால்நடை பராமரிப்புத் துறை' },
  other: { en: 'Gram Panchayat Administrative Office', ta: 'கிராம ஊராட்சி நிர்வாக அலுவலகம்' }
};

export function getGrievanceDepartment(category: string): { en: string; ta: string } {
  return (
    GRIEVANCE_DEPARTMENT_MAP[category] || {
      en: 'Gram Panchayat Administrative Office',
      ta: 'கிராம ஊராட்சி நிர்வாக அலுவலகம்'
    }
  );
}

/**
 * Shared helper to print an isolated HTML document in a hidden iframe
 */
function printHtmlInIframe(htmlContent: string, documentTitle?: string): void {
  if (typeof window === 'undefined') return;

  const originalDocTitle = document.title;
  if (documentTitle) {
    document.title = documentTitle;
  }

  let iframe = document.getElementById('pds-print-iframe') as HTMLIFrameElement;
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.id = 'pds-print-iframe';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);
  }

  const doc = iframe.contentWindow?.document;
  if (doc) {
    doc.open();
    doc.write(htmlContent);
    doc.close();
    if (documentTitle && iframe.contentWindow?.document) {
      iframe.contentWindow.document.title = documentTitle;
    }

    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch {
        window.print();
      } finally {
        if (documentTitle) {
          setTimeout(() => {
            document.title = originalDocTitle;
          }, 1500);
        }
      }
    }, 250);
  } else {
    window.print();
    if (documentTitle) {
      setTimeout(() => {
        document.title = originalDocTitle;
      }, 1500);
    }
  }
}

/**
 * 1. Citizen Request Acknowledgment Receipt
 */
export function printAcknowledgmentReceipt(ticket: ReceiptData): void {
  if (typeof window === 'undefined') return;

  const dateStr = new Date(ticket.createdAt).toLocaleString('ta-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const receiptHtml = `
    <!DOCTYPE html>
    <html lang="ta">
      <head>
        <meta charset="utf-8" />
        <title>மனு ஒப்புதல் ரசீது - ${ticket.id}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 10mm 15mm;
          }
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Noto Sans Tamil', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          body {
            background: #ffffff;
            color: #0f172a;
            font-size: 12px;
            line-height: 1.4;
            padding: 10px;
          }
          .receipt-box {
            border: 2px solid #0f172a;
            border-radius: 12px;
            padding: 20px 24px;
            max-width: 180mm;
            margin: 0 auto;
            background: #ffffff;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 2px solid #0f172a;
            padding-bottom: 12px;
            margin-bottom: 14px;
          }
          .header-left {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .logo {
            width: 52px;
            height: 52px;
            border-radius: 50%;
            border: 2px solid #15803d;
            object-fit: cover;
          }
          .header-titles h1 {
            font-size: 16px;
            font-weight: 900;
            color: #064e3b;
            line-height: 1.2;
          }
          .header-titles h2 {
            font-size: 12px;
            font-weight: 800;
            color: #0f172a;
          }
          .header-titles p {
            font-size: 10px;
            color: #475569;
          }
          .header-right {
            text-align: right;
          }
          .badge {
            display: inline-block;
            background: #0f172a;
            color: #fde047;
            font-size: 10px;
            font-weight: 900;
            padding: 2px 8px;
            border-radius: 4px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
          }
          .operator-info {
            font-size: 10px;
            font-weight: 700;
            color: #334155;
          }
          .banner {
            background: #f1f5f9;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            padding: 6px 10px;
            text-align: center;
            margin-bottom: 14px;
          }
          .banner h3 {
            font-size: 13px;
            font-weight: 900;
            color: #0f172a;
            letter-spacing: 0.5px;
          }
          .banner p {
            font-size: 10px;
            color: #64748b;
          }
          .details-table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #94a3b8;
            border-radius: 8px;
            overflow: hidden;
            margin-bottom: 14px;
          }
          .details-table tr {
            border-bottom: 1px solid #cbd5e1;
          }
          .details-table tr:last-child {
            border-bottom: none;
          }
          .details-table td {
            padding: 8px 12px;
            font-size: 11px;
            vertical-align: middle;
          }
          .details-table td.label {
            width: 35%;
            font-weight: 700;
            color: #475569;
            background: #f8fafc;
            border-right: 1px solid #cbd5e1;
          }
          .details-table td.value {
            width: 65%;
            font-weight: 600;
            color: #0f172a;
          }
          .ticket-id {
            font-family: monospace;
            font-size: 16px;
            font-weight: 900;
            color: #064e3b;
          }
          .status-badge {
            display: inline-block;
            background: #dcfce7;
            color: #166534;
            border: 1px solid #86efac;
            font-weight: 800;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
          }
          .notice-box {
            background: #fffbeb;
            border: 1px solid #fde68a;
            border-radius: 8px;
            padding: 10px 14px;
            margin-bottom: 16px;
          }
          .notice-box h4 {
            font-size: 11px;
            font-weight: 800;
            color: #78350f;
            margin-bottom: 4px;
          }
          .notice-box ul {
            padding-left: 16px;
            font-size: 10px;
            color: #92400e;
            line-height: 1.5;
          }
          .signatures {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            border-top: 1px solid #cbd5e1;
            padding-top: 14px;
            margin-top: 14px;
          }
          .stamp-box {
            width: 120px;
            height: 50px;
            border: 1px dashed #94a3b8;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 9px;
            color: #94a3b8;
          }
          .sig-box {
            text-align: right;
          }
          .sig-script {
            font-family: 'Times New Roman', serif;
            font-style: italic;
            font-size: 15px;
            font-weight: bold;
            color: #064e3b;
            margin-bottom: 2px;
          }
          .sig-title {
            font-size: 11px;
            font-weight: 800;
            color: #0f172a;
          }
          .sig-sub {
            font-size: 9px;
            color: #64748b;
          }
          .footer {
            border-top: 1px solid #e2e8f0;
            margin-top: 14px;
            padding-top: 6px;
            text-align: center;
            font-size: 9px;
            color: #94a3b8;
          }
        </style>
      </head>
      <body>
        <div class="receipt-box">
          <div class="header">
            <div class="header-left">
              <img src="/images/logo.png" alt="இலச்சினை" class="logo" />
              <div class="header-titles">
                <h1>பெரியகோட்டை கிராம பஞ்சாயத்து</h1>
                <h2>நால்ரோடு மக்கள் இ-சேவை மையம்</h2>
                <p>நால்ரோடு சந்திப்பு, பெரியகோட்டை, ஒட்டன்சத்திரம் தாலுகா, திண்டுக்கல் - 624614</p>
              </div>
            </div>
            <div class="header-right">
              <span class="badge">EFADGL0636</span>
              <p class="operator-info">ஆபரேட்டர்: முருகேசன் கு</p>
              <p class="operator-info">அழைக்க: 97903 82437</p>
            </div>
          </div>

          <div class="banner">
            <h3>மனு பதிவு ஒப்புதல் ரசீது (ACKNOWLEDGMENT SLIP)</h3>
            <p>Citizen Service Request & Application Verification Voucher</p>
          </div>

          <table class="details-table">
            <tr>
              <td class="label">மனு கண்காணிப்பு எண் (Request ID):</td>
              <td class="value"><span class="ticket-id">${ticket.id}</span></td>
            </tr>
            <tr>
              <td class="label">தற்போதைய நிலை (Status):</td>
              <td class="value"><span class="status-badge">${ticket.status || 'Submitted (பதிவு செய்யப்பட்டது)'}</span></td>
            </tr>
            <tr>
              <td class="label">விண்ணப்பதாரர் பெயர் (Applicant):</td>
              <td class="value"><strong>${ticket.citizenName}</strong></td>
            </tr>
            <tr>
              <td class="label">செல்போன் எண் (Mobile):</td>
              <td class="value">${ticket.phoneNumber}</td>
            </tr>
            <tr>
              <td class="label">கோரப்பட்ட சேவை (Service):</td>
              <td class="value"><strong>${ticket.serviceName}</strong></td>
            </tr>
            <tr>
              <td class="label">கிராமம் / முகவரி (Village):</td>
              <td class="value">${ticket.village || 'பெரியகோட்டை'}</td>
            </tr>
            <tr>
              <td class="label">பதிவு தேதி & நேரம் (Date & Time):</td>
              <td class="value">${dateStr}</td>
            </tr>
            <tr>
              <td class="label">சேவை மையம் (CSC Centre):</td>
              <td class="value">நால்ரோடு மக்கள் இ-சேவை மையம் (e-Sevai ID: EFADGL0636)</td>
            </tr>
          </table>

          <div class="notice-box">
            <h4>📌 விண்ணப்பதாரருக்கான முக்கிய வழிகாட்டுதல்கள்:</h4>
            <ul>
              <li>உங்கள் மனுவின் தற்போதைய நிலையை அறிய <strong>periyakottai.vercel.app/track</strong> தளத்தில் <strong>${ticket.id}</strong> எண்ணை உள்ளிடவும்.</li>
              <li>சான்றிதழ் மற்றும் ஆவண சரிபார்ப்பிற்கு நால்ரோடு இ-சேவை மையத்திற்கு அசல் சான்றிதழ்களுடன் வரவும்.</li>
              <li>அரசு நிர்ணயித்த சேவை கட்டணம் மட்டுமே செலுத்த வேண்டும். கூடுதல் உதவிக்கு ஆபரேட்டரை <strong>97903 82437</strong> என்ற எண்ணில் அழைக்கலாம்.</li>
            </ul>
          </div>

          <div class="signatures">
            <div>
              <div class="stamp-box">[ மைய முத்திரை ]</div>
              <p style="font-size: 9px; color: #64748b; margin-top: 3px;">நால்ரோடு மக்கள் இ-சேவை மையம்</p>
            </div>
            <div class="sig-box">
              <div class="sig-script">Murugesan K</div>
              <p class="sig-title">ஆபரேட்டர் கையொப்பம்</p>
              <p class="sig-sub">முருகேசன் குப்புசாமி (97903 82437)</p>
            </div>
          </div>

          <div class="footer">
            பெரியகோட்டை கிராம பஞ்சாயத்து டிஜிட்டல் சேவை தளம் | கணினி மூலம் தானாக உருவாக்கப்பட்ட ரசீது | பக்கம்: 1 / 1
          </div>
        </div>
      </body>
    </html>
  `;

  printHtmlInIframe(receiptHtml);
}

/**
 * 2. Official Civic Grievance Memo PDF Generator
 * Formats the entire grievance into a neat, high-authority, 1-page A4 document
 * suitable for official government action, field inspection, and administrative records.
 */
export function printOfficialGrievancePdf(grv: GrievanceTicket): void {
  if (typeof window === 'undefined') return;

  const applicantName = (grv.citizenName || 'Applicant').trim().replace(/[\\/:*?"<>|]/g, '');

  const filingDateStr = new Date(grv.createdAt).toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const forwardDateStr = new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const dept = getGrievanceDepartment(grv.category);

  const memoHtml = `
    <!DOCTYPE html>
    <html lang="ta">
      <head>
        <meta charset="utf-8" />
        <title>${applicantName}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 8mm 12mm;
          }
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Noto Sans Tamil', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          body {
            background: #ffffff;
            color: #0f172a;
            font-size: 11px;
            line-height: 1.35;
            padding: 6px;
          }
          .memo-box {
            border: 2px solid #0f172a;
            border-radius: 10px;
            padding: 16px 20px;
            max-width: 185mm;
            margin: 0 auto;
            background: #ffffff;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 2px solid #0f172a;
            padding-bottom: 10px;
            margin-bottom: 10px;
          }
          .header-left {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .logo {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            border: 2px solid #064e3b;
            object-fit: cover;
          }
          .header-titles h1 {
            font-size: 15px;
            font-weight: 900;
            color: #064e3b;
            line-height: 1.15;
            text-transform: uppercase;
          }
          .header-titles h2 {
            font-size: 11px;
            font-weight: 800;
            color: #0f172a;
          }
          .header-titles p {
            font-size: 9.5px;
            color: #475569;
          }
          .header-right {
            text-align: right;
          }
          .badge {
            display: inline-block;
            background: #064e3b;
            color: #ffffff;
            font-size: 9.5px;
            font-weight: 900;
            padding: 2.5px 8px;
            border-radius: 4px;
            letter-spacing: 0.5px;
            margin-bottom: 3px;
          }
          .operator-info {
            font-size: 9.5px;
            font-weight: 700;
            color: #334155;
          }
          .banner {
            background: #0f172a;
            color: #ffffff;
            border-radius: 6px;
            padding: 6px 12px;
            text-align: center;
            margin-bottom: 12px;
          }
          .banner h3 {
            font-size: 12px;
            font-weight: 900;
            letter-spacing: 0.5px;
            color: #fde047;
          }
          .banner p {
            font-size: 9.5px;
            color: #cbd5e1;
            margin-top: 1px;
          }
          .meta-table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #94a3b8;
            border-radius: 6px;
            overflow: hidden;
            margin-bottom: 10px;
          }
          .meta-table tr {
            border-bottom: 1px solid #cbd5e1;
          }
          .meta-table tr:last-child {
            border-bottom: none;
          }
          .meta-table td {
            padding: 5.5px 9px;
            font-size: 10.5px;
            vertical-align: middle;
          }
          .meta-table td.label {
            width: 32%;
            font-weight: 700;
            color: #334155;
            background: #f8fafc;
            border-right: 1px solid #cbd5e1;
          }
          .meta-table td.value {
            width: 68%;
            font-weight: 600;
            color: #0f172a;
          }
          .ticket-id {
            font-family: monospace;
            font-size: 14px;
            font-weight: 900;
            color: #064e3b;
          }
          .status-badge {
            display: inline-block;
            background: #eff6ff;
            color: #1d4ed8;
            border: 1px solid #93c5fd;
            font-weight: 900;
            padding: 2px 7px;
            border-radius: 4px;
            font-size: 10px;
            text-transform: uppercase;
          }
          .dept-badge {
            display: inline-block;
            background: #fdf2f8;
            color: #9d174d;
            border: 1px solid #fbcfe8;
            font-weight: 800;
            padding: 2px 7px;
            border-radius: 4px;
            font-size: 10.5px;
          }
          .complaint-section {
            border: 1.5px solid #0f172a;
            border-radius: 6px;
            background: #f8fafc;
            padding: 9px 12px;
            margin-bottom: 10px;
          }
          .complaint-title {
            font-size: 11px;
            font-weight: 900;
            color: #064e3b;
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .complaint-text {
            font-size: 11.5px;
            line-height: 1.45;
            color: #0f172a;
            white-space: pre-wrap;
            font-weight: 600;
            background: #ffffff;
            border: 1px solid #cbd5e1;
            border-radius: 5px;
            padding: 8px 10px;
          }
          .official-action-box {
            border: 1px solid #94a3b8;
            border-radius: 6px;
            padding: 8px 10px;
            margin-bottom: 10px;
            background: #ffffff;
          }
          .official-action-box h4 {
            font-size: 10.5px;
            font-weight: 900;
            color: #0f172a;
            margin-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }
          .action-lines {
            margin-top: 6px;
            border-top: 1px dashed #cbd5e1;
            padding-top: 6px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            font-size: 9.5px;
            color: #64748b;
          }
          .directives-box {
            background: #fefce8;
            border: 1px solid #fef08a;
            border-radius: 6px;
            padding: 7px 10px;
            margin-bottom: 10px;
            font-size: 9.5px;
            color: #854d0e;
            line-height: 1.4;
          }
          .signatures {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            border-top: 1.5px solid #0f172a;
            padding-top: 10px;
            margin-top: 8px;
          }
          .stamp-box {
            width: 140px;
            height: 48px;
            border: 1px dashed #64748b;
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 9px;
            color: #64748b;
            background: #f8fafc;
          }
          .sig-box {
            text-align: right;
            width: 180px;
          }
          .sig-script {
            font-family: 'Times New Roman', serif;
            font-style: italic;
            font-size: 15px;
            font-weight: bold;
            color: #064e3b;
            margin-bottom: 2px;
          }
          .sig-title {
            font-size: 10.5px;
            font-weight: 900;
            color: #0f172a;
          }
          .sig-sub {
            font-size: 9px;
            color: #475569;
          }
          .footer {
            border-top: 1px solid #e2e8f0;
            margin-top: 8px;
            padding-top: 4px;
            text-align: center;
            font-size: 8.5px;
            color: #64748b;
          }
        </style>
      </head>
      <body>
        <div class="memo-box">
          <div class="header">
            <div class="header-left">
              <img src="/images/logo.png" alt="இலச்சினை" class="logo" />
              <div class="header-titles">
                <h1>பெரியகோட்டை கிராம ஊராட்சி</h1>
                <h2>PERIYAKOTTAI GRAM PANCHAYAT</h2>
                <p>ஊரக வளர்ச்சி மற்றும் ஊராட்சித் துறை • ஒட்டன்சத்திரம் தாலுகா, திண்டுக்கல் மாவட்டம் - 624614</p>
              </div>
            </div>
            <div class="header-right">
              <span class="badge">EFADGL0636 • CSC</span>
              <p class="operator-info">ஆபரேட்டர்: முருகேசன் கு</p>
              <p class="operator-info">அழைக்க: 97903 82437</p>
            </div>
          </div>

          <div class="banner">
            <h3>அரசாங்க குறைதீர்ப்பு நடவடிக்கை குறிப்பாணை (OFFICIAL ACTION MEMO)</h3>
            <p>Direct Field Inspection & Administrative Action Order • Gram Panchayat Civic Redressal</p>
          </div>

          <table class="meta-table">
            <tr>
              <td class="label">மனு எண் (Grievance ID):</td>
              <td class="value"><span class="ticket-id">${grv.id}</span></td>
            </tr>
            <tr>
              <td class="label">ஒதுக்கப்பட்ட துறை (Department):</td>
              <td class="value"><span class="dept-badge">${dept.ta} (${dept.en})</span></td>
            </tr>
            <tr>
              <td class="label">பிரச்சனை பிரிவு (Category):</td>
              <td class="value"><strong>${grv.category}</strong></td>
            </tr>
            <tr>
              <td class="label">நிர்வாக நிலை (Status):</td>
              <td class="value"><span class="status-badge">அதிகாரிக்கு அனுப்பப்பட்டது (Forwarded to Official)</span></td>
            </tr>
            <tr>
              <td class="label">மனுதாரர் பெயர் (Petitioner):</td>
              <td class="value"><strong>${grv.citizenName}</strong></td>
            </tr>
            <tr>
              <td class="label">தொடர்பு எண் (Mobile):</td>
              <td class="value"><strong>${grv.phoneNumber}</strong></td>
            </tr>
            <tr>
              <td class="label">கிராம பகுதி / இடம் (Location):</td>
              <td class="value">${grv.location || grv.village}</td>
            </tr>
            <tr>
              <td class="label">பதிவு தேதி (Registered Date):</td>
              <td class="value">${filingDateStr}</td>
            </tr>
            <tr>
              <td class="label">அனுப்பப்பட்ட தேதி (Forwarded Date):</td>
              <td class="value">${forwardDateStr}</td>
            </tr>
          </table>

          <div class="complaint-section">
            <div class="complaint-title">
              <span>📋 மனுதாரரின் முழுமையான புகார் விவரம் (Citizen's Detailed Statement):</span>
              <span style="font-size: 9.5px; color: #475569; font-weight: normal;">நேரடி பதிவு</span>
            </div>
            <div class="complaint-text">${grv.description}</div>
          </div>

          <div class="directives-box">
            <strong>📌 கள ஆய்வு மற்றும் தீர்வுக்கான அதிகாரப்பூர்வ அறிவுறுத்தல்கள் (Directives):</strong>
            <p>1. இந்த மனு பெரியகோட்டை கிராம ஊராட்சி டிஜிட்டல் சேவை தளம் மூலம் பதிவு செய்யப்பட்டு உடனடி நடவடிக்கைக்காக சமர்ப்பிக்கப்படுகிறது.</p>
            <p>2. சம்பந்தப்பட்ட துறை அலுவலர் / களப் பணியாளர் உடனடியாக குறிப்பிட்ட இடத்திற்குச் சென்று ஆய்வு செய்து தீர்வுக்கு ஆவன செய்யுமாறு கோரப்படுகிறது.</p>
            <p>3. எடுக்கப்பட்ட நடவடிக்கைகள் குறித்த தகவலை நால்ரோடு மக்கள் இ-சேவை மையத்திற்கு (97903 82437) தெரிவிக்குமாறு கேட்டுக்கொள்ளப்படுகிறது.</p>
          </div>

          <div class="official-action-box">
            <h4>கள ஆய்வு & நடவடிக்கை குறிப்பு (Field Inspection & Action Taken Report):</h4>
            <div style="height: 28px; border-bottom: 1px dotted #cbd5e1; margin-top: 4px;"></div>
            <div class="action-lines">
              <div>ஆய்வு செய்யப்பட்ட தேதி (Inspection Date): _______________</div>
              <div>முடிவு நிலை (Action Status): [ ] தீர்க்கப்பட்டது  [ ] தொடர் நடவடிக்கை</div>
            </div>
          </div>

          <div class="signatures">
            <div>
              <div class="stamp-box">[ மைய முத்திரை & ஒப்புதல் ]</div>
              <p style="font-size: 9px; color: #475569; margin-top: 3px;">நால்ரோடு மக்கள் இ-சேவை மையம்</p>
              <p style="font-size: 8.5px; color: #64748b;">முருகேசன் கு (EFADGL0636)</p>
            </div>
            <div>
              <div class="stamp-box" style="border-style: solid; border-color: #cbd5e1;">[ துறை அதிகாரி முத்திரை ]</div>
              <p style="font-size: 8.5px; color: #64748b; margin-top: 3px; text-align: center;">அலுவலக முத்திரை</p>
            </div>
            <div class="sig-box">
              <div style="height: 24px;"></div>
              <p class="sig-title">துறை அதிகாரி கையொப்பம்</p>
              <p class="sig-sub">VAO / பஞ்சாயத்து செயலாளர் / மின்வாரிய அதிகாரி</p>
            </div>
          </div>

          <div class="footer">
            பெரியகோட்டை கிராம ஊராட்சி டிஜிட்டல் குறைதீர்ப்பு தளம் • அதிகாரப்பூர்வ அரசாங்க ஆவணம் • பக்கம் 1 / 1
          </div>
        </div>
      </body>
    </html>
  `;

  printHtmlInIframe(memoHtml, applicantName);
}

/**
 * 3. Formats the entire grievance into a detailed, structured WhatsApp message
 * directed to the operator's own WhatsApp number (97903 82437)
 * ready to be forwarded to the competent authority (VAO, Panchayat Secretary, Lineman, etc.)
 */
export function generateOfficialForwardingWhatsAppUrl(grv: GrievanceTicket): string {
  const dept = getGrievanceDepartment(grv.category);
  const dateStr = new Date(grv.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const text = 
`🏛️ *பெரியகோட்டை கிராம ஊராட்சி - அதிகாரப்பூர்வ நடவடிக்கை குறிப்பாணை*
*PERIYAKOTTAI GRAM PANCHAYAT - OFFICIAL GRIEVANCE FORWARDING MEMO*
━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 *மனு எண் (Grievance ID):* ${grv.id}
📅 *பதிவு தேதி (Filing Date):* ${dateStr}
🚦 *நிலை (Status):* அதிகாரிக்கு அனுப்பப்பட்டது (Forwarded to Official)
🏢 *ஒதுக்கப்பட்ட துறை (Department):* ${dept.ta} (${dept.en})
📁 *பிரிவு (Category):* ${grv.category}

👤 *மனுதாரர் பெயர் (Petitioner):* ${grv.citizenName}
📞 *செல்போன் (Mobile):* ${grv.phoneNumber}
📍 *இடம் / பகுதி (Hamlet):* ${grv.location || grv.village}

📝 *முழுமையான புகார் விவரம் (Detailed Grievance):*
"${grv.description}"

━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 *அனுப்புநர் (Forwarded By):*
முருகேசன் கு (Murugesan K)
நால்ரோடு மக்கள் இ-சேவை மையம் (CSC ID: EFADGL0636)
தொலைபேசி: 97903 82437

_குறிப்பு: இந்த குறைதீர்ப்பு மனு கிராம மக்கள் நலனுக்காக பதிவு செய்யப்பட்டு உரிய துறை அதிகாரியின் நேரடி கள ஆய்விற்கும் உடனடி தீர்விற்கும் ஆபரேட்டர் மூலம் அனுப்பப்படுகிறது._`;

  return `https://wa.me/919790382437?text=${encodeURIComponent(text)}`;
}
