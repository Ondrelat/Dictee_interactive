import { dictation } from '@prisma/client';
import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import Image from 'next/image';

interface AudioProps {
  dictation: dictation;
  audioIndexParam: number;
}

export default function Audio({ dictation, audioIndexParam }: AudioProps) {
  const [audioIndex, setAudioIndex] = useState(audioIndexParam);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isPlaybackRateOpen, setIsPlaybackRateOpen] = useState(false);
  const [isVolumeOpen, setIsVolumeOpen] = useState(false);

  const [isProgressChanging, setIsProgressChanging] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioSrc = `${dictation.audio_url}/${dictation.title.replace(/ /g, '_')}_partie_${audioIndex}.mp3`;

  const [duration, setDuration] = useState({ minutes: 0, seconds: 0 });

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const minutes = Math.floor(audio.duration / 60);
      const seconds = Math.floor(audio.duration % 60);
      setDuration({ minutes, seconds });
    }
  }, [audioRef]);

  useEffect(() => {
    setAudioIndex(audioIndexParam);
  }, [audioIndexParam]);

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      if (audio) {
        const progress = (audio.currentTime / audio.duration) * 100;
        setProgress(progress);
      }
    };

    audio?.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio?.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (audio) {
      isPlaying ? audio.pause() : audio.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioChange = (index: number) => {
    setAudioIndex(index);
  };

  const togglePlaybackRate = () => {
    setIsPlaybackRateOpen(!isPlaybackRateOpen);
  };

  const changePlaybackRate = (rate: number) => {
    audioRef.current!.playbackRate = rate;
    setIsPlaybackRateOpen(false);
  };

  const toggleVolume = () => {
    setIsVolumeOpen(!isVolumeOpen);
  };

  const changeVolume = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    audioRef.current!.volume = newVolume;
    setVolume(newVolume);
  };

  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const progressBarWidth = event.currentTarget.offsetWidth;
      const clickX = event.nativeEvent.offsetX;
      const newProgress = (clickX / progressBarWidth) * 100;
      const newTime = (audioRef.current.duration * newProgress) / 100;
      audioRef.current.currentTime = newTime;
      setIsProgressChanging(true);
    }
  };

  const handleProgressChangeEnd = () => {
    setIsProgressChanging(false);
  };

  useEffect(() => {

    const audio = audioRef.current;
    if (audio && isPlaying) {
      audio.load(); // Charge le nouvel audio
      audio.play(); /// Joue le nouvel audio
    }
  }, [audioIndex, isPlaying]);

  if (!dictation?.audio_url) {
    return <p>Le chemin du fichier audio n est pas disponible.</p>;
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <Image src="/images/micro.jpg" width={500} height={460} alt="Image de microphone pour l'audio de la dictée" className="responsive-image opacity-50" />
        </div>
        <div className="w-96 bg-white p-5 rounded shadow-md z-10">
          <audio ref={audioRef} src={audioSrc} className="w-full mb-4"></audio>
          <div className="flex items-center justify-between mb-4">
            <button
              className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white focus:outline-none"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            <div className="flex items-center flex-grow justify-center">
              <button
                className="mr-4 focus:outline-none"
                onClick={() => handleAudioChange(audioIndex - 1)}
                disabled={audioIndex === 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-4.28 9.22a.75.75 0 000 1.06l3 3a.75.75 0 101.06-1.06l-1.72-1.72h5.69a.75.75 0 000-1.5h-5.69l1.72-1.72a.75.75 0 00-1.06-1.06l-3 3z" clipRule="evenodd" />
                </svg>
              </button>
              <div className="text-sm text-gray-600 text-center">
                Partie {audioIndex}/{dictation.audio_total_part}
                <br />
                Durée: {duration.minutes} m {duration.seconds} s
              </div>
              <button
                className="ml-4 focus:outline-none"
                onClick={() => handleAudioChange(audioIndex + 1)}
                disabled={audioIndex === dictation.audio_total_part}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="flex items-center">
              <div className="relative">
                <button
                  className="focus:outline-none"
                  onClick={togglePlaybackRate}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M10.5 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd" />
                  </svg>
                </button>
                {isPlaybackRateOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
                    {[0.5, 1, 1.5, 2].map((rate) => (
                      <button
                        key={rate}
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        onClick={() => changePlaybackRate(rate)}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative ml-4">
                <button
                  className="focus:outline-none"
                  onClick={toggleVolume}
                >
                  {volume === 0 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 001.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 00-1.06-1.06l-1.72 1.72-1.72-1.72z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                      <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
                    </svg>
                  )}
                </button>
                {isVolumeOpen && (
                  <div className="absolute bottom-0 right-0 mb-4 mr-4 w-6 h-24 bg-transparent z-10">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={changeVolume}
                      className="absolute left-1/2 transform -translate-x-1/2 w-2 h-full bg-transparent appearance-none cursor-pointer"
                      style={{
                        WebkitAppearance: 'slider-vertical',
                        outline: 'none',
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div
            className="w-full h-2 bg-gray-300 rounded cursor-pointer"
            onClick={handleProgressClick}
            onMouseUp={handleProgressChangeEnd}
            onMouseLeave={handleProgressChangeEnd}
            >
            <div
                className={`h-full ${
                isProgressChanging ? 'bg-blue-500' : 'bg-green-500'
                } rounded`}
                style={{ width: `${progress}%` }}
            ></div>
            </div>
        </div>
      </div>
    </div>
  );
}