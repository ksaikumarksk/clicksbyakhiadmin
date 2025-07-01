// function lengthOfLongestSubstring(s: string): number {
//     let allSubStrings = []

//     for (let i = 0; i < s.length; i++) {
//         for (let j = i + 1; j <= s.length; j++) {
//             let currentSubString = s.substring(i, j);
//             if (new Set(currentSubString).size === currentSubString.length) {
//                 allSubStrings.push(currentSubString);
//             }
//         }
//     }


//     console.log("All Substrings:", allSubStrings);
    

//     return allSubStrings.reduce((longest, current) => {
//         const currentLength = current.length;
//         const longestLength = longest.length;

//         if (currentLength > longestLength) {
//             return current;
//         } else {
//             return longest;
//         }
//     }, "");
    
// };


// lengthOfLongestSubstring("abcabcbb")