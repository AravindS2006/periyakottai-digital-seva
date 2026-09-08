/**
 * Periyakottai Digital Seva - 1-Page Official Acknowledgment Receipt Printer
 * Generates an isolated single-page A4 / receipt document so the browser
 * prints EXACTLY 1 page instead of printing the 12-page background web application.
 */

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
          <!-- Header -->
          <div class="header">
            <div class="header-left">
              <img src="/images/logo.png" alt="இலச்சினை" class="logo" />
              <div class="header-titles">
                <h1>பெரியாக்கோட்டை கிராம பஞ்சாயத்து</h1>
                <h2>நால்ரோடு மக்கள் இ-சேவை மையம்</h2>
                <p>நால்ரோடு சந்திப்பு, பெரியாக்கோட்டை, ஒட்டன்சத்திரம் தாலுகா, திண்டுக்கல் - 624614</p>
              </div>
            </div>
            <div class="header-right">
              <span class="badge">EFADGL0636</span>
              <p class="operator-info">ஆபரேட்டர்: முருகேசன் கு</p>
              <p class="operator-info">அழைக்க: 97903 82437</p>
            </div>
          </div>

          <!-- Banner -->
          <div class="banner">
            <h3>மனு பதிவு ஒப்புதல் ரசீது (ACKNOWLEDGMENT SLIP)</h3>
            <p>Citizen Service Request & Application Verification Voucher</p>
          </div>

          <!-- Key Details -->
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
              <td class="value">${ticket.village || 'பெரியாக்கோட்டை'}</td>
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

          <!-- Notice -->
          <div class="notice-box">
            <h4>📌 விண்ணப்பதாரருக்கான முக்கிய வழிகாட்டுதல்கள்:</h4>
            <ul>
              <li>உங்கள் மனுவின் தற்போதைய நிலையை அறிய <strong>www.periyakottai.in/track</strong> தளத்தில் <strong>${ticket.id}</strong> எண்ணை உள்ளிடவும்.</li>
              <li>சான்றிதழ் மற்றும் ஆவண சரிபார்ப்பிற்கு நால்ரோடு இ-சேவை மையத்திற்கு அசல் சான்றிதழ்களுடன் வரவும்.</li>
              <li>அரசு நிர்ணயித்த சேவை கட்டணம் மட்டுமே செலுத்த வேண்டும். கூடுதல் உதவிக்கு ஆபரேட்டரை <strong>97903 82437</strong> என்ற எண்ணில் அழைக்கலாம்.</li>
            </ul>
          </div>

          <!-- Signatures -->
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

          <!-- Footer -->
          <div class="footer">
            பெரியாக்கோட்டை கிராம பஞ்சாயத்து டிஜிட்டல் சேவை தளம் | கணினி மூலம் தானாக உருவாக்கப்பட்ட ரசீது | பக்கம்: 1 / 1
          </div>
        </div>
      </body>
    </html>
  `;

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
    doc.write(receiptHtml);
    doc.close();

    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch {
        window.print();
      }
    }, 300);
  } else {
    window.print();
  }
}
