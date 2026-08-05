DELETE FROM memory
WHERE id IN (
  'demo-memory-photo-v1',
  'demo-memory-story-v1',
  'demo-memory-voice-v1',
  'demo-memory-video-v1',
  'demo-memory-milestone-v1',
  'demo-memory-letter-v1'
);

DELETE FROM time_capsule
WHERE id IN ('demo-capsule-open-v1', 'demo-capsule-locked-v1');
