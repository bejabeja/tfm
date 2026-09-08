export const parseError = async (response, defaultMsg = "Something went wrong") => {
  let msg = defaultMsg;
  let field;
  try {
    const data = await response.json();
    msg = data?.error || msg;
    field = data?.field;
  } catch (_) { }
  const error = new Error(msg);
  error.status = response.status;
  error.field = field;
  throw error;
}

// A parseError()-thrown error whose status is 403 always means requirePremium
// blocked the request (see api/src/middlewares/requirePremium.js) - named here
// so client/mobile call sites don't each hardcode the magic number.
export const isPremiumRequiredError = (error) => error?.status === 403;