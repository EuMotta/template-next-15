/* eslint-disable @typescript-eslint/no-explicit-any */
function handleApiError(error: unknown, fallbackMessage = 'Erro inesperado.') {
  let message = fallbackMessage;

  if (typeof error === 'object' && error !== null) {
    const err = error as any;

    if (Array.isArray(err?.response?.data?.errors)) {
      message = err.response.data.errors.map((e: any) => e.message).join('\n');
    } else if (typeof err?.response?.data?.message === 'string') {
      message = err.response.data.message;
    } else if (Array.isArray(err?.response?.data?.message)) {
      message = err.response.data.message.join('\n');
    } else if (typeof err.message === 'string') {
      message = err.message;
    }
  }

  return message;
}
export { handleApiError };
