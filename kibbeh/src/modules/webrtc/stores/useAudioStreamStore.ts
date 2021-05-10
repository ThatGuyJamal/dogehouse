import create from "zustand";
import { combine } from "zustand/middleware";

export const useAudioStreamStore = create(
  combine(
    {
      audioStreamMap: {} as Record<
        string,
        { stream: MediaStream; volume: number; audioRef?: HTMLAudioElement }
      >,
    },
    (set) => ({
      setAudioRef: (userId: string, audioRef: HTMLAudioElement) => {
        set((s) => {
          if (userId in s.audioStreamMap) {
            return {
              audioStreamMap: {
                ...s.audioStreamMap,
                [userId]: {
                  ...s.audioStreamMap[userId],
                  audioRef,
                },
              },
            };
          }

          console.log("could not find consumer for ", userId);
          return s;
        });
      },
      setVolume: (userId: string, volume: number) => {
        set((s) =>
          userId in s.audioStreamMap
            ? {
                audioStreamMap: {
                  ...s.audioStreamMap,
                  [userId]: {
                    ...s.audioStreamMap[userId],
                    volume,
                  },
                },
              }
            : s
        );
      },
      add: (c: MediaStream, userId: string) =>
        set((s) => {
          let volume = 100;
          if (userId in s.audioStreamMap) {
            const x = s.audioStreamMap[userId];
            volume = x.volume;
            // x.consumer.close();
          }
          return {
            audioStreamMap: {
              ...s.audioStreamMap,
              [userId]: { stream: c, volume },
            },
          };
        }),
      closeAll: () =>
        set((s) => {
          // Object.values(s.audioStreamMap).forEach(
          //   ({ stream: c }) => !c.closed && c.close()
          // );
          return {
            audioStreamMap: {},
          };
        }),
    })
  )
);
