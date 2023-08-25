export const maskEmail = (email: string): string => {
  return email.replace(/(\w)(.+?)(@)(\w)(.+?)(.\w+$)/gm, "$1*****$3$4*****$6");
};
