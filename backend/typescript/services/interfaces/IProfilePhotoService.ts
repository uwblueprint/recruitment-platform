interface IProfilePhotoService {
  /**
   * Look up the Google profile picture for a Blueprint email
   * @param email the user's Blueprint email
   * @returns a picture URL, or null if the email is not a Blueprint address,
   * has no picture, or the lookup is unavailable
   */
  getPhotoUrl(email: string): Promise<string | null>;
}

export default IProfilePhotoService;
