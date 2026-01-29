
export const getWelcomeEmailTemplate = (name: string) => `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; background-color: #f9f9f9; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #3b82f6; padding-bottom: 15px; }
    .logo { color: #3b82f6; font-size: 28px; font-weight: bold; text-decoration: none; }
    .content { color: #333333; line-height: 1.6; }
    .button { display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; border-radius: 5px; text-decoration: none; margin-top: 20px; font-weight: bold; }
    .footer { margin-top: 30px; text-align: center; color: #888888; font-size: 12px; border-top: 1px solid #eeeeee; padding-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <a href="https://www.blobjor.me" class="logo">blobjor.me</a>
    </div>
    <div class="content">
      <h2>أهلاً بك يا ${name}! 👋</h2>
      <p>شكراً لانضمامك إلى عائلة blobjor.me. نحن سعيدون جداً بوجودك معنا.</p>
      <p>اكتشف مجموعتنا المميزة من المنتجات المصممة خصيصاً لك، أو ابدأ في تصميم منتجك الخاص الآن.</p>
      <div style="text-align: center;">
        <a href="https://www.blobjor.me/products" class="button">تصفح المنتجات</a>
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} blobjor.me. جميع الحقوق محفوظة.</p>
    </div>
  </div>
</body>
</html>
`;

export const getOrderConfirmationEmailTemplate = (order: any) => {
  const itemsHtml = order.items.map((item: any) => `
    <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding: 10px 0;">
      <div>
        <strong>${item.productName}</strong>
        ${item.size ? `<br><small>المقاس: ${item.size}</small>` : ''}
        ${item.color ? `<br><small>اللون: ${item.color}</small>` : ''}
        <br><small>الكمية: ${item.quantity}</small>
      </div>
      <div>
        ${item.price} د.أ
      </div>
    </div>
  `).join('');

  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; background-color: #f9f9f9; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #22c55e; padding-bottom: 15px; }
    .logo { color: #22c55e; font-size: 28px; font-weight: bold; text-decoration: none; }
    .order-info { background-color: #f0fdf4; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #dcfce7; }
    .total { font-size: 18px; font-weight: bold; text-align: left; margin-top: 20px; color: #15803d; }
    .footer { margin-top: 30px; text-align: center; color: #888888; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <a href="https://www.blobjor.me" class="logo">blobjor.me</a>
    </div>
    <div class="content">
      <h2>شكراً لطلبك! 🎉</h2>
      <p>مرحباً ${order.customerName}،</p>
      <p>لقد استلمنا طلبك بنجاح وسنبدأ في تجهيزه قريباً.</p>
      
      <div class="order-info">
        <strong>رقم الطلب:</strong> #${order.id}<br>
        <strong>تاريخ الطلب:</strong> ${new Date().toLocaleDateString('ar-JO')}<br>
        <strong>حالة الدفع:</strong> ${order.paymentMethod === 'cod' ? 'الدفع عند الاستلام' : 'مدفوع'}
      </div>

      <h3>تفاصيل الطلب:</h3>
      ${itemsHtml}

      <div class="total">
        المجموع الكلي: ${order.totalPrice} د.أ
      </div>

      <p>سنرسل لك إشعاراً آخر عند شحن الطلب.</p>
    </div>
    <div class="footer">
      <p>لديك سؤال؟ تواصل معنا عبر الواتساب: +962791234567</p>
      <p>© ${new Date().getFullYear()} blobjor.me</p>
    </div>
  </div>
</body>
</html>
`;
};

export const getResetPasswordEmailTemplate = (otp: string) => `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; background-color: #f9f9f9; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #3b82f6; padding-bottom: 15px; }
    .logo { color: #3b82f6; font-size: 28px; font-weight: bold; text-decoration: none; }
    .content { color: #333333; line-height: 1.6; }
    .otp-box { background-color: #eff6ff; border: 2px dashed #3b82f6; border-radius: 8px; padding: 15px; text-align: center; font-size: 32px; letter-spacing: 5px; font-weight: bold; color: #1e3a8a; margin: 20px 0; }
    .footer { margin-top: 30px; text-align: center; color: #888888; font-size: 12px; border-top: 1px solid #eeeeee; padding-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <a href="https://www.blobjor.me" class="logo">blobjor.me</a>
    </div>
    <div class="content">
      <h2>إعادة تعيين كلمة المرور 🔒</h2>
      <p>لقد استلمنا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك.</p>
      <p>استخدم رمز التحقق التالي لإكمال العملية:</p>
      
      <div class="otp-box">
        ${otp}
      </div>

      <p style="margin-top: 20px; font-size: 14px;">
        صلاحية هذا الرمز هي ساعة واحدة فقط.
      </p>
      <p style="font-size: 12px; color: #666;">
        إذا لم تطلب هذا الرمز، يرجى تجاهل هذه الرسالة.
      </p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} blobjor.me. جميع الحقوق محفوظة.</p>
    </div>
  </div>
</body>
</html>
`;


export const getAdminNewOrderEmailTemplate = (order: any, customer: any) => `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <style>
    body { font-family: sans-serif; direction: rtl; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; border: 1px solid #ccc; padding: 20px; border-radius: 8px; }
    .header { background: #f3f4f6; padding: 10px; text-align: center; font-weight: bold; margin-bottom: 20px; }
    .item { border-bottom: 1px solid #eee; padding: 10px 0; display: flex; justify-content: space-between; }
    .total { font-weight: bold; font-size: 1.2em; margin-top: 20px; text-align: left; }
    .customer-info { margin-bottom: 20px; background: #fffbe6; padding: 15px; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">طلب جديد! 🚀 (#${order.id})</div>
    
    <div class="customer-info">
      <strong>معلومات العميل:</strong><br>
      الاسم: ${customer.name}<br>
      الهاتف: ${customer.phone}<br>
      العنوان: ${customer.city} - ${customer.address}<br>
    </div>

    <h3>تفاصيل الطلب:</h3>
    ${order.items.map((item: any) => `
      <div class="item">
        <div>
          ${item.productName} (x${item.quantity})
          ${item.size ? `| ${item.size}` : ''} 
          ${item.color ? `| ${item.color}` : ''}
        </div>
        <div>${item.subtotal} د.أ</div>
      </div>
    `).join('')}

    <div class="total">
      الإجمالي: ${order.totalPrice} د.أ
    </div>

    <div style="margin-top: 20px; text-align: center;">
      <a href="https://www.blobjor.me/admin/orders/${order.id}" style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">عرض الطلب في لوحة التحكم</a>
    </div>
  </div>
</body>
</html>
`;

export const getVerificationEmailTemplate = (name: string, otp: string) => `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <style>
    body { font-family: sans-serif; direction: rtl; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px; }
    .otp { font-size: 24px; font-weight: bold; color: #3b82f6; text-align: center; margin: 20px 0; letter-spacing: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <h2>مرحباً ${name}،</h2>
    <p>يرجى استخدام رمز التحقق التالي لتأكيد بريدك الإلكتروني:</p>
    <div class="otp">${otp}</div>
    <p>هذا الرمز صالح لمدة 10 دقائق.</p>
  </div>
</body>
</html>
`;
