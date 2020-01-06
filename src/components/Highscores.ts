import Component from '../../lib/Component'
import { Template } from '../../lib/Types'
import Coordinates from '../../lib/helpers/Coordinates'
import Repeating, { RepeatingProps } from '../../lib/components/logical/Repeating'
import Text, { TextProps } from '../../lib/components/native/Text'


type ScoreData = {
   score: number,
   name: string,
}

type HighscoresProps = {}

export default class Highscores extends Component<HighscoresProps> {
   private scores: ScoreData[] = []

   protected onInit() {
      fetch('https://garden-defense.firebaseio.com/highscores.json?orderBy="score"&limitToLast=10').then((res) => {
         return res.json()
      }).then((json) => {
         const scores: ScoreData[] = []
         for(const score in json) {
            scores.push(json[score])
         }

         const sorted = scores.sort((a, b): number => {
            if(a.score < b.score) return 1
            if(a.score > b.score) return -1
            return 0
         })

         this.scores = sorted
      })
   }

   protected template: Template = [
      {
         component: new Repeating(),
         position: (): Coordinates => new Coordinates(0, 0),
         props: (): RepeatingProps => ({
            list: this.scores,
            component: () => new Text(),
            position: (data: ScoreData, index: number): Coordinates => {
               return new Coordinates(0, index * 30)
            },
            props: (data: ScoreData, index: number): TextProps => {
               return {
                  text: `#${index + 1} ${data.name}: ${data.score}`,
                  color: '#fff',
               }
            }
         })
      },
   ]
}
