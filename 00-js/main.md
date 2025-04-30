## 🌟 1. 語法糖 - 更簡潔的寫法

### 傳統寫法

```
const name = "小明";
const greeting = "你好，" + name + "！";
```

### 模板字符串（Template Literals）

```
const modernGreeting = `你好，${name}！`; <== ✍️
console.log(modernGreeting); // 你好，小明！
```

## 🎮 2. ES6 箭頭函式（Arrow Function）

### 傳統函式

```
const traditionalSum = function(a, b) {
    return a + b;
};
```

### 箭頭函式 - 更簡潔！

```
const modernSum = (a, b) => a + b;
```

### 箭頭函式與陣列方法的組合

```
const fruits = ['蘋果', '香蕉', '橘子'];
const fruitLength = fruits.map(fruit => fruit.length);
```

## 🎲 3. 物件字面語法增強（Object Enhancement）

```
const level = 5;
const power = 100;
```

### 傳統寫法

```
const traditionalPlayer = {
    level: level,
    power: power,
    attack: function() {
        return this.power * this.level;
    }
};
```

### 現代寫法

```
const modernPlayer = {
    level,  // 屬性簡寫
    power,
    attack() {  // 方法簡寫
        return this.power * this.level;
    }
};
```

## 🎯 4. 解構（Destructuring）

### 陣列解構

```
const scores = [95, 88, 76];
const [highest, middle, lowest] = scores;
console.log(`最高分：${highest}`); // 最高分：95
```

### 物件解構

```
const student = {
    studentName: '小明',
    age: 18,
    grades: {
        math: 90,
        english: 85
    }
};

const { studentName, age, grades: { math } } = student;
console.log(`${studentName} 的數學成績是 ${math}`); // 小明 的數學成績是 90
```

## 🎨 5. 展開語法（Spread）

### 陣列合併

```
const team1 = ['小明', '小華'];
const team2 = ['小菁', '小強'];
const allTeams = [...team1, ...team2];
console.log(allTeams); // ['小明', '小華', '小菁', '小強']
```

### 物件擴展

```
const baseCharacter = {
    hp: 100,
    mp: 50
};

const warrior = {
    ...baseCharacter,
    attack: 80,
    defense: 60
};
```

## 🎁 6. 函式參數預設值（Default parameters）

```
const createPlayer = (name = '無名英雄', level = 1, hp = 100) => {
    return { name, level, hp };
};

console.log(createPlayer()); // { name: '無名英雄', level: 1, hp: 100 }
console.log(createPlayer('勇者', 5)); // { name: '勇者', level: 5, hp: 100 }
```

## 🌈 7. Promise 和非同步處理

```
const loadPlayerData = (id) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const player = {
                id,
                name: '勇者',
                level: 10
            };
            resolve(player);
        }, 1000);
    });
};
```

### 使用 async/await

```
const startGame = async () => {
    try {
        const player = await loadPlayerData(1);
        console.log(`歡迎回來，${player.name}！`);
    } catch (error) {
        console.log('載入失敗');
    }
};
```

## 🎵 8. 可選串連（Optional chaining）

```
const game = {
    player: {
        // skills 可能不存在
        // skills: {
        //     magic: ['火球', '冰箭']
        // }
    }
};
```

### 安全地存取深層屬性

```
const firstSkill = game.player?.skills?.magic?.[0] ?? '尚未學習技能';
console.log(firstSkill); // 尚未學習技能
```