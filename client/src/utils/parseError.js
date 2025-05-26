export const parseError = async (response, fallbackMessage = "Something went wrong") => {
  const data = await response.json().catch(() => ({}));
  const message = data.message || fallbackMessage;
  throw new Error(message);
};