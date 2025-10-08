/**
 * Extracts and formats backend error messages
 * Backend sends errors as: "{type of error}: {error detail in pt-br}"
 * We extract the detail part (already in Portuguese)
 */
export const translateError = (error: string | undefined, statusCode?: number): string => {
  if (!error) {
    return 'erro desconhecido, entre em contato com o suporte.';
  }

  // Check if error follows backend format: "TYPE: detail in pt-br"
  if (error.includes(':')) {
    const parts = error.split(':');
    if (parts.length >= 2) {
      // Return the detail part (everything after the first colon)
      return parts.slice(1).join(':').trim();
    }
  }

  // If no colon format and status is 500, show support message
  if (statusCode === 500) {
    return 'erro interno do servidor, entre em contato com o suporte.';
  }

  // Return original error message from backend
  return error;
};

/**
 * Formats error message for display to user
 * @param action - The action being performed (e.g., "adicionar colmeia", "atualizar colmeia")
 * @param error - The error message from backend
 * @param statusCode - Optional HTTP status code
 */
export const formatErrorMessage = (action: string, error: string | undefined, statusCode?: number): string => {
  const translatedError = translateError(error, statusCode);
  return `Erro ao ${action}: ${translatedError}`;
};

/**
 * Provides generic HTTP status messages (only used when backend doesn't provide a message)
 */
export const translateHttpStatus = (status: number): string => {
  if (status === 500) {
    return 'Erro interno do servidor, entre em contato com o suporte.';
  }
  
  // Generic fallback for other status codes
  return `Erro ${status}, entre em contato com o suporte.`;
};

