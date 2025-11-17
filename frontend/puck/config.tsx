import type { Config } from '@measured/puck';
import type { Base } from '@airtable/blocks/interface/models';
import Hero from './components/Hero';
import Columns from './components/Columns';
import Text from './components/Text';
import { createStatsCard } from './components/StatsCard';

export function createConfig(base: Base): Config {
  return {
    components: {
      Hero: Hero as any,
      Columns: Columns as any,
      Text: Text as any,
      StatsCard: createStatsCard(base) as any,
    },
  };
}
