export const calculateDate = (date: Date | undefined) => {
  if (!date) return "";

  const now = new Date();
  const diff = Math.floor(now.getTime() - date.getTime());
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) return `${years} yıl önce`;
  if (months > 0) return `${months} ay önce`;
  if (days > 0) return `${days} gün önce`;
  if (hours > 0) return `${hours} saat önce`;

  if (minutes > 0) {
    if (minutes < 5) return `Birkaç dakika önce`;
    return `${minutes} dakika önce`;
  }

  if (seconds > 0) {
    if (seconds < 15) return `Birkaç saniye önce`;
    return `${seconds} saniye önce`;
  }

  return "Şimdi";
};
