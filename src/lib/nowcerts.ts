// Helper functions for NowCerts authentication

export interface NowCertsUser {
  nowcerts_token: string;
  user_email: string;
  userDisplayName: string;
  userTeamTag: string;
}

/**
 * Extracts the last word from a display name and converts it to lowercase
 * Example: "Paula Venegas - TP" -> "tp"
 */
export function getLastWordFromDisplayName(displayName: string): string {
  const words = displayName.trim().split(/\s+/);
  return words[words.length - 1].toLowerCase();
}

/**
 * Gets the current NowCerts user from localStorage
 */
export function getNowCertsUser(): NowCertsUser | null {
  try {
    const token = localStorage.getItem('nowcerts_token');
    const email = localStorage.getItem('user_email');
    const displayName = localStorage.getItem('userDisplayName');
    const teamTag = localStorage.getItem('userTeamTag');

    if (!token || !email || !displayName || !teamTag) {
      return null;
    }

    return {
      nowcerts_token: token,
      user_email: email,
      userDisplayName: displayName,
      userTeamTag: teamTag,
    };
  } catch {
    return null;
  }
}

/**
 * Checks if the user is authenticated
 */
export function isAuthenticated(): boolean {
  return getNowCertsUser() !== null;
}

/**
 * Clears all authentication data from localStorage
 */
export function clearAuth(): void {
  localStorage.removeItem('nowcerts_token');
  localStorage.removeItem('user_email');
  localStorage.removeItem('userDisplayName');
  localStorage.removeItem('userTeamTag');
}
