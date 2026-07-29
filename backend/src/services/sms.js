async function sendOtpSms(phone, code) {
  console.log(`[SMS المحاكاة] إرسال رمز التحقق ${code} إلى ${phone}`);
  return true;
}

module.exports = { sendOtpSms };