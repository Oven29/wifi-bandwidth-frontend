import React, { useState, useEffect, useRef } from 'react';
import { DEFAULT_IMAGE } from '../../entities/activity/model/mock';
import '../../styles/widgets/MediaViewer.css';

interface MediaViewerProps {
  videoUrl?: string;
  imageUrl?: string;
  title: string;
  autoPlay?: boolean;
  loop?: boolean;
  className?: string;
}

export const MediaViewer: React.FC<MediaViewerProps> = ({
  videoUrl,
  imageUrl,
  title,
  autoPlay = true,
  loop = true,
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState<boolean>(!videoUrl);
  const [imgSrc, setImgSrc] = useState<string>(imageUrl || DEFAULT_IMAGE);

  // Сброс состояния при смене источника
  useEffect(() => {
    setVideoFailed(!videoUrl);
    setImgSrc(imageUrl || DEFAULT_IMAGE);
  }, [videoUrl, imageUrl]);

  // Управление автовоспроизведением видео через useRef
  useEffect(() => {
    if (!videoFailed && videoRef.current && videoUrl) {
      videoRef.current.load();
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Автоплей заблокирован браузером — остается постер
        });
      }
    }
  }, [videoUrl, videoFailed]);

  const handleVideoError = () => {
    setVideoFailed(true);
  };

  const handleImageError = () => {
    if (imgSrc !== DEFAULT_IMAGE) {
      setImgSrc(DEFAULT_IMAGE);
    }
  };

  const isUsingFallback = videoFailed && imgSrc === DEFAULT_IMAGE;

  return (
    <div className={`media-viewer ${className}`}>
      {isUsingFallback && (
        <span className="media-viewer-fallback-badge">По умолчанию</span>
      )}

      {!videoFailed && videoUrl ? (
        <video
          ref={videoRef}
          src={videoUrl}
          className="media-viewer-video"
          autoPlay={autoPlay}
          loop={loop}
          muted
          playsInline
          poster={imgSrc}
          onError={handleVideoError}
        />
      ) : (
        <img
          src={imgSrc}
          alt={title}
          className="media-viewer-image"
          onError={handleImageError}
        />
      )}
    </div>
  );
};
