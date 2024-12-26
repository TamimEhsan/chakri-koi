import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";


export default function AISuggestion({ grammarText }) {

  const [diff, setDiff] = useState([]);

  const findDiff = () => {
    console.log(grammarText);
    let orgWords = grammarText.original_text.split(" ");
    let corWords = grammarText.corrected_text.split(" ");
    let orgWordsLength = orgWords.length;
    let corWordsLength = corWords.length;
    console.log(orgWords, corWords);
    // create a 2D array to store the edit distance
    let dp = new Array(orgWordsLength + 1);
    
    for (let i = 0; i <= orgWordsLength; i++) {
      dp[i] = new Array(corWordsLength + 1);
    }
    // fill the dp array with the base case values
    for (let i = 0; i <= orgWordsLength; i++) {
      for (let j = 0; j <= corWordsLength; j++) {
        if (i == 0) {
          dp[i][j] = j;
        } else if (j == 0) {
          dp[i][j] = i;
        } else {
          dp[i][j] = -1;
        }
      }
    }

    // fill the dp array with the edit distance values
    for (let i = 1; i <= orgWordsLength; i++) {
      for (let j = 1; j <= corWordsLength; j++) {
        if (orgWords[i - 1] == corWords[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    // backtracking to find the difference
    let i = orgWordsLength;
    let j = corWordsLength;
    let difff = [];
    while (i > 0 && j > 0) {
      if (orgWords[i - 1] == corWords[j - 1]) {
        i--;
        j--;
        difff.push([orgWords[i], corWords[j]]);
      } else if (dp[i][j] == 1 + dp[i - 1][j - 1]) {
        //diff = `Replace ${orgWords[i - 1]} with ${corWords[j - 1]}\n` + diff;
        difff.push([orgWords[i - 1], corWords[j - 1]]);
        i--;
        j--;
      } else if (dp[i][j] == 1 + dp[i - 1][j]) {
        // diff = `Delete ${orgWords[i - 1]}\n` + diff;
        difff.push([orgWords[i - 1], ""]);
        i--;
      } else {
        // diff = `Insert ${corWords[j - 1]}\n` + diff;
        difff.push(["", corWords[j - 1]]);
        j--;
      }
    }

    for (let k = i - 1; k >= 0; k--) {
      difff.push([orgWords[k], ""]);
    }
    for (let k = j - 1; k >= 0; k--) {
      difff.push(["", corWords[k]]);
    }

    // print the difference
    // reverse the diff array to get the correct order
    difff.reverse();
    console.log(difff.length);
    return difff;
  }

  useEffect(() => {
    const difff = findDiff();
    setDiff(difff);
  }, [grammarText])

 
  return (
    <div className="overflow-y-auto text-lg">
      <ScrollArea className="h-[700px] w-full rounded-md border p-4">
        <div className="flex flex-wrap">
        {
          diff.map((item, index) => {
            return (
              <>
                {
                  item[0] == item[1] ? (
                    <span className="mr-1">{item[0]}</span>
                  ) : (
                    <span className="mr-1">
                      <span className="text-red-500 line-through">{item[0]}</span>
                      <span className="text-green-500">{item[1]}</span>
                    </span>
                  )
                }
              </>
            )
          })
        }
        </div>
      </ScrollArea>
    </div>
  )

}