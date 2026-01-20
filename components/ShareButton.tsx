'use client';

import { DaySchedule, formatDate } from '@/lib/data';

interface ShareButtonProps {
  day: DaySchedule;
  className?: string;
}

export default function ShareButton({ day, className = '' }: ShareButtonProps) {
  const generateShareText = () => {
    // Basic text construction
    let text = '';
    if (day.isHoliday) {
      text = `📅 *${formatDate(day.date)}*\n\n🎉 *${day.holidayName}*\nSchool Holiday`;
    } else {
      text = `📅 *${formatDate(day.date)}*\n\n🏫 *Today's Schedule*\n\n`;
      for (const item of day.schedule) {
        if (item.subject === 'Snack Break') {
          text += `☕ ${item.time} - Break\n`;
        } else if (item.subject === 'Meditation') {
          text += `🧘 ${item.time} - Meditation\n`;
        } else {
          const emoji = getSubjectEmoji(item.subject);
          text += `${emoji} ${item.time} - *${item.subject}*`;
          if (item.activity) {
            text += `\n   _${item.activity}_`;
          }
          text += '\n';
        }
      }
    }

    // Append Footer with Link
    text += `\n_via SchoolPulse_ 💓\nhttps://schoolpuls.in/`;
    return text;
  };

  const getSubjectEmoji = (subject: string): string => {
    const emojiMap: Record<string, string> = {
      'LITERACY': '📚',
      'NUMERACY': '🔢',
      'KANNADA': '🇮🇳',
      'HINDI': '📝',
      'GENERAL AWARENESS': '🌍',
      'STORY': '📖',
      'ART': '🎨',
      'Prayer/Rhymes': '🙏',
      'General Assembly': '🎤',
      'SOCIO EMOTIONAL': '💝',
    };

    for (const [key, emoji] of Object.entries(emojiMap)) {
      if (subject.toUpperCase().includes(key.toUpperCase())) {
        return emoji;
      }
    }
    return '📌';
  };

  const generateCalendarIcon = async (dateStr: string): Promise<File | null> => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      const date = new Date(dateStr);
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
      const weekday = date.toLocaleString('default', { weekday: 'long' });

      // Draw Icon Background (White with rounded corners simulated by simple rect if mask handles it, but let's be nice)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.rect(0, 0, 512, 512); // Simple rect is safer for full bleed
      ctx.fill();

      // Header (Month) - Red
      ctx.fillStyle = '#ef4444'; // Tailwind red-500
      ctx.fillRect(0, 0, 512, 160);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 100px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(month, 256, 80);

      // Body (Date) - Black
      ctx.fillStyle = '#111827'; // Tailwind gray-900
      ctx.font = 'bold 240px sans-serif';
      ctx.fillText(day.toString(), 256, 310);

      // Weekday - Gray
      ctx.fillStyle = '#6b7280'; // Tailwind gray-500
      ctx.font = '50px sans-serif';
      ctx.fillText(weekday, 256, 450);

      // Convert to Blob/File
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], 'daily-schedule.png', { type: 'image/png' }));
          } else {
            resolve(null);
          }
        }, 'image/png');
      });
    } catch (e) {
      console.error('Failed to generate icon', e);
      return null;
    }
  };

  const shareViaWhatsApp = () => {
    const text = generateShareText();
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const shareNative = async () => {
    const text = generateShareText();
    let shareData: ShareData = {
      title: `Schedule for ${formatDate(day.date)}`,
      text: text,
    };

    // Try to generate and attach image using dynamic icon
    if (typeof navigator.canShare === 'function') {
      const iconFile = await generateCalendarIcon(day.date);
      if (iconFile) {
        const fileShareData = { ...shareData, files: [iconFile] };
        // Check if files sharing is supported
        if (navigator.canShare(fileShareData)) {
          shareData = fileShareData;
        }
      }
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Share failed/cancelled', err);
        // Fallback or ignore
      }
    } else {
      shareViaWhatsApp();
    }
  };

  return (
    <button
      onClick={shareNative}
      className={`flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium ${className}`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
      Share
    </button>
  );
}
