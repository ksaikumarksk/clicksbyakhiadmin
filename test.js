// const input = [
//     { state: "Up", city: "agra" },
//     { state: "Up", city: "Hy" },
//     { state: "Up", city: "by" },
//     { state: "Up", city: "cy" },
//     { state: "mp", city: "ch" },
//     { state: "mp", city: "dh" },
//     { state: "mp", city: "fh" },
//   ];

// const groupFun = (arr) => {
//     const group = {};
//     arr.forEach((item)=>{
//         if(group[item.state]){
//             group[item.state].push(item.city)
//         }else{
//             group[item.state]= [item.city]
//         }
//     })

//     const result =[]

//     for (let state in group){
//         result.push({state:state , city:group[state]})
//     }
//     return result
//   };

  
//   console.log(groupFun(input));

// const a = [1,2,3,4,]
// const b = [5,1,2,3,4,]

// const f = [...a, ...b]

// const s = f.sort((a,b)=>a-b)
// console.log(s);
  

//removeDuplicates
// nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4];

// const s = [new Set(nums)]
// const b = [...s[0]]
// console.log(b);

// const fin=(nums)=>{

//     let i = 0;

//     nums.forEach((num)=>{
//         if(nums[i] !==num){
//             i++
//             nums[i]=num
//         }
//     })
//     return i +1;

// }

// console.log(fin(nums));

//Remove Element
// const nums = [0,1,2,2,3,0,4,2]
// const value = 2
// i = 0
// const fun =(nums, val)=>{

//     nums.forEach((num)=>{
//         if(num !== val){
//             nums[i]=num
//             i++
//         }
//     })
//     return i
// }

// console.log(fun(nums,value))

// const haystack = "sadbutsad"
// const needle = "sad"
// const haystack = "leetcode"
// const needle = "leeto"

// const s = haystack.indexOf(needle)
// console.log("sss",s);


//Search Insert Position
// const nums = [1,3,5,6]
// const  target = 5


// const searchINsert = (nums,taget)=>{
//     let index = nums.length
//     for (let i=0;i<index;i++){
//         if(nums[i]===taget){
//             return i
//         }
//     }
//     // nums.forEach((num,i)=>{
//     //     if(taget <= num && index === nums.length){
//     //         index =i
//     //     }

//     //     })
//     //     return index
//     }

//     console.log(searchINsert(nums,target))



const arr = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },{ id: 2, name: "Bob" }
]

const uniqueUsers = arr.filter(
  (user, index, self) =>
    index === self.findIndex(u => JSON.stringify(u) === JSON.stringify(user))
);

console.log(uniqueUsers);

// const uniqueById = (array) => {
//   const seen = new Set();
//   return array.filter(item => {
//     if (seen.has(item.id)) {
//       return false;
//     } else {
//       seen.add(item.id);
//       return true;
//     }
//   });
// }   
// console.log(uniqueById(arr));

