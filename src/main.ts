import globby = require('globby');
import * as child from 'child_process';
import cliProgress from 'cli-progress';

import { MkvMerge, TrackProperties } from './@types/mkvmerge';

export type AudioProperty = TrackProperties | undefined;
export type AudioProperties = AudioProperty[] | undefined;

export const main = async (path: string, lang1: string, lang2: string) : Promise<boolean> => {
  let updated = 0;
  let failed = 0;
  const paths = await globby(`${path}/**/*.mkv`);
  const progress = new cliProgress.SingleBar(
    {
      format: 'progress [{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | {updated} updated | {failed} failed',
      stream: process.stdout
    },
    cliProgress.Presets.shades_classic
  );
  progress.start(paths.length, 0, { updated, failed });
  for (const path of paths) {
    try {
      const metadata: MkvMerge = JSON.parse(child.execSync(`mkvmerge -J "${path}"`).toString());
      const audioProperties: AudioProperties = metadata.tracks?.filter(m => m.type === 'audio').map(m => m.properties);
  
      const a1 = audioProperties?.find(ap => ap?.language === lang1);
      const a2 = audioProperties?.find(ap => ap?.language === lang2);
      if (a1?.number !== undefined && a2?.number !== undefined && a1.number > a2.number) {
        try {
          child.execSync(`mkvpropedit --edit track:@${a1.number} --set track-number=${a2.number} --edit track:@${a2.number} --set track-number=${a1.number} "${path}"`)
          updated++;
        } catch (error) {
          console.error(`${error}`);
          failed++;
        }
      }
    } catch (error) {
      console.error(`${error}`);
      failed++;
    }
    progress.increment({ updated, failed });
  }
  progress.stop();
  return true;
}
