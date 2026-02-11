export const playNotificationSound = async (): Promise<void> => {
  try {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGe77OeeSwwPUKXh8LdjHAU2kdXzzn0vBSF1xe/glEILElyx6OyrWBUIQ5zd8sFuJAUuhM/z24k2Bxdmue3mnEoMDU+j4O+2YhwENo/T8tB+MAUfcsXv4pVDCxFbr+frrVkVB0Ga3PLDcCUFLIHO8tiJNQcXZrjt5ZtJCw1Po+Dvt2McBDaP0/LQfjAFH3LF7+KVQwsRW6/n661ZFQdBmtzyxHElBSuBzvLYiTUHF2a47eWbSQsNT6Pg77djHAQ2j9Py0H4wBR9yxe/ilUMLEVuv5+utWRUHQZrc8sRxJQUrgc7y2Ik1BxdmuO3lm0kLDU+j4O+3YxwENo/T8tB+MAUfcsXv4pVDCxFbr+frrVkVB0Ga3PLEcSUFK4HO8tiJNQcXZrjt5ZtJCw1Po+Dvt2McBDaP0/LQfjAFH3LF7+KVQwsRW6/n661ZFQdBmtzyxHElBSuBzvLYiTUHF2a47eWbSQsNT6Pg77djHAQ2j9Py0H4wBR9yxe/ilUMLEVuv5+utWRUHQZrc8sRxJQUrgc7y2Ik1BxdmuO3lm0kLDU+j4O+3YxwENo/T8tB+MAUfcsXv4pVDCxFbr+frrVkVB0Ga3PLEcSUFK4HO8tiJNQcXZrjt5ZtJCw1Po+Dvt2McBDaP0/LQfjAFH3LF7+KVQwsRW6/n661ZFQdBmtzyxHElBSuBzvLYiTUHF2a47eWbSQsNT6Pg77djHAQ2j9Py0H4wBR9yxe/ilUMLEVuv5+utWRUHQZrc8sRxJQUrgc7y2Ik1BxdmuO3lm0kLDU+j4O+3YxwENo/T8tB+MAUfcsXv4pVDCxFbr+frrVkVB0Ga3PLEcSUFK4HO8tiJNQcXZrjt5ZtJCw1Po+Dvt2McBDaP0/LQfjAFH3LF7+KVQwsRW6/n661ZFQdBmtzyxHElBSuBzvLYiTUHF2a47eWbSQsNT6Pg77djHAQ2j9Py0H4wBR9yxe/ilUMLEVuv5+utWRUHQZrc8sRxJQU=');
    audio.volume = 1.0;
    await audio.play().catch(() => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      const playBeep = (frequency: number, startTime: number, duration: number) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.8, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };

      const now = audioContext.currentTime;
      playBeep(800, now, 0.2);
      playBeep(1000, now + 0.25, 0.2);
      playBeep(1200, now + 0.5, 0.25);
    });

    console.log('🔔 Notification sound played!');
  } catch (error) {
    console.error('Could not play notification sound:', error);
  }
};
