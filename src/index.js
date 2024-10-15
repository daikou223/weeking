import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
class Styl{
  constructor(){
    this.table = {
      width:"200px",
      height:"150px"
    };
    this.go={
      backgroundColor:"lightgreen",
    };
    this.come={
      backgroundColor:"pink",
    };
    this.td ={
      border:"2px solid black",
    } ;
    this.cont = {
      height:"100px",
    }
    this.button = {
      height:"50px",
      width:"50px"
    }
    this.memo = {
      fontSize:"20px",
    }
  }
}
const styl = new Styl();
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

class Clock{
  constructor(hour= 0,minute= 0){
    this.hour = hour;
    this.minute = minute;
  }
  add(otherClock){
    let newClock = new Clock(this.hour + otherClock.hour,this.minute + otherClock.minute)
    if(newClock.minute >= 60){
      newClock.minute -= 60;
      newClock.hour += 1;
    }
    return newClock
  }
  sub(otherClock){
    let newClock = new Clock(this.hour - otherClock.hour,this.minute - otherClock.minute)
    if(newClock.minute < 0){
      newClock.minute += 60;
      newClock.hour -= 1;
    }
    return newClock
  }
  Kcompare(otherClock) {
    if(this.hour>otherClock.hour){
      return false
    }
    else if(this.hour<otherClock.hour){
      return true
    }
    else{
      if(this.minute>=otherClock.minute){
        return false
      }
      else if(this.hour<otherClock.minute){
        return true
      }
    }
  }
  print(){
    if(this.minute == 0){
      return this.hour + ":00";
    }
    return this.hour + ":" + this.minute;
  }
}

// 親コンポーネント App
function App() {
  // tasksをAppで管理し、初期状態をlocalStorageから取得
  const [tasks, setTasks] = useState(() => {
    let savedTasks = JSON.parse(localStorage.getItem('tasks'));
    console.log(savedTasks);
    if(!(savedTasks)){
      savedTasks = [[],[],[],[],[],[],[]];
    }
    let lit = [[],[],[],[],[],[],[]]
    for(let i = 0;i<7;i++){
      console.log(savedTasks[i]);
      for(let j = 0;j<savedTasks[i].length;j++){
        console.log(i,j);
        const tsk = savedTasks[i][j];
        lit[i].push({name:tsk.name,start:new Clock(tsk.start.hour,tsk.start.minute),end:new Clock(tsk.end.hour,tsk.end.minute),goto:new Clock(tsk.goto.hour,tsk.goto.minute)})
      }
    }
    return lit;
  });

  // tasksが変更されたらlocalStorageに保存
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Week tasks={tasks} />} />
        <Route path="/today/:date" element={<Today tasks={tasks} setTasks={setTasks} />} />
      </Routes>
    </Router>
  );
}

function Week({ tasks }) {
  const navigate = useNavigate();
  
  function setDay(day) {
    navigate(`/today/${day}`, {
      state: { date: day },
    });
  }
  return (
    <div>
      <table style = {styl.table}>
          <tr>
            <td><button onClick={() => setDay(0)} style = {styl.button}>月</button></td>
            <td><button onClick={() => setDay(1)} style = {styl.button}>火</button></td>
            <td><button onClick={() => setDay(2)} style = {styl.button}>水</button></td>
            <td><button onClick={() => setDay(3)} style = {styl.button}>木</button></td>
            </tr>
          <tr>
            {/* 各日のタスクを表示 */}
            <td style = {styl.td}><Task tasks = {tasks[0]} /></td>
            <td style = {styl.td}><Task tasks = {tasks[1]} /></td>
            <td style = {styl.td}><Task tasks = {tasks[2]} /></td>
            <td style = {styl.td}><Task tasks = {tasks[3]} /></td></tr>
          <tr>
            <td><button onClick={() => setDay(4)} style = {styl.button}>金</button></td>
            <td><button onClick={() => setDay(5)} style = {styl.button}>土</button></td>
            <td><button onClick={() => setDay(6)} style = {styl.button}>日</button></td>
            <td style = {styl.memo}>めも</td>
          </tr>
          <tr>
            <td style = {styl.td}><Task tasks = {tasks[4]} /></td>
            <td style = {styl.td}><Task tasks = {tasks[5]} /></td>
            <td style = {styl.td}><Task tasks = {tasks[6]} /></td>
            <td style = {styl.td}></td>
          </tr>
      </table>
    </div>
  );
}

function Today({ tasks, setTasks }) {
  const { date } = useParams();
  const navigate = useNavigate();
  const day = ["月","火","水","木","金","土","日"];
  function setdata() {
    let taskName = document.getElementById("name").value;
    let startTime = document.getElementById("starttime").value;
    let endTime = document.getElementById("endtime").value;
    let gototime = document.getElementById("gototime").value;

    // 新しいタスクを作成
    const newTask = {
      name: taskName,
      start: new Clock(Number(startTime.split(":")[0]),Number(startTime.split(":")[1])),
      end: new Clock(Number(endTime.split(":")[0]),Number(endTime.split(":")[1])),
      goto: new Clock(Number(gototime.split(":")[0]),Number(gototime.split(":")[1])),
    };

    // tasksの特定の日付に新しいタスクを追加する
    setTasks(prevTasks => {
      const updatedTasks = [...prevTasks];
      updatedTasks[date] = [...updatedTasks[date], newTask];
      return updatedTasks;
    });

    // 入力フィールドのリセット
    document.getElementById("name").value = "";
    document.getElementById("starttime").value = "";
    document.getElementById("endtime").value = "";
    document.getElementById("gototime").value = "";
  }

  function back() {
    navigate(`/`);
  }

  function dlt(indx) {
    // タスクを削除
    setTasks(prevTasks => {
      const updatedTasks = [...prevTasks];
      updatedTasks[date].splice(indx, 1);
      return updatedTasks;
    });
  }

  function setjuk(s,e){
    document.getElementById("name").value = "塾";
    document.getElementById("starttime").value = "";
    document.getElementById("endtime").value = "";
    document.getElementById("gototime").value = "01:00";
    if(s == 6){
      document.getElementById("starttime").value = "17:00";
    }
    if(s == 7){
      document.getElementById("starttime").value = "18:30";
    }
    if(s == 8){
      document.getElementById("starttime").value = "20:00";
    }
    if(e == 6){
      document.getElementById("endtime").value = "18:30";
    }
    if(e == 7){
      document.getElementById("endtime").value = "20:00";
    }
    if(e == 8){
      document.getElementById("endtime").value = "21:30";
    }
  }

  function asakawa(){
    document.getElementById("name").value = "浅川家";
    document.getElementById("starttime").value = "17:00";
    document.getElementById("endtime").value = "19:00";
    document.getElementById("gototime").value = "00:15";
  }

  function dete(){
    document.getElementById("name").value = "ゲーセン";
    document.getElementById("starttime").value = "12:00";
    document.getElementById("endtime").value = "15:00";
    document.getElementById("gototime").value = "01:00";
  }

  function exp(){
    document.getElementById("name").value = "実験";
    document.getElementById("starttime").value = "13:00";
    document.getElementById("endtime").value = "17:00";
    document.getElementById("gototime").value = "02:30";
  }
  return (
    <div>
      {day[date]}<br/>
      <button onClick = {()=> setjuk(6,6)}>塾6コマ</button>
      <button onClick = {()=> setjuk(7,7)}>塾7コマ</button>
      <button onClick = {()=> setjuk(8,8)}>塾8コマ</button><br/>
      <button onClick = {()=> setjuk(6,7)}>塾6~7コマ</button>
      <button onClick = {()=> setjuk(7,8)}>塾7~8コマ</button>
      <button onClick = {()=> setjuk(6,8)}>塾6~8コマ</button><br/>
      <button onClick = {()=> asakawa()}>浅川家</button>
      <button onClick = {()=> dete()}>ゲーセン</button>
      <button onClick = {()=> exp()}>実験</button><br/>
      <input type="text" id="name" placeholder="Task Name" />
      <input type="time" id="starttime" placeholder="Start Time" />
      <input type="time" id="endtime" placeholder="End Time" />
      <input type="time" id="gototime" placeholder="Goto Time" />
      <button onClick={() => setdata()}>登録</button><br />
      <ul>
        {tasks[date] && tasks[date].map((t, index) => (
          <div key={index}>
            <li>
              {t.name}: {t.start.print()} ~ {t.end.print()}
            </li>
            <button onClick={() => dlt(index)}>削除</button>
          </div>
        ))}
      </ul>
      <button onClick={() => back()}>戻る</button>
    </div>
  );
}

function Task({tasks}){
  let tstr = [];
  let outdoorTime = new Clock(24,0);
  let comehomeTime = new Clock(0,0);
  for(let j = 0;j<tasks.length;j++){
    console.log(tasks[j]);
    let st = tasks[j].start;
    let et = tasks[j].end;
    let gt = tasks[j].goto;
    if(st.sub(gt).Kcompare(outdoorTime)){
      outdoorTime = st.sub(gt);
      console.log(outdoorTime);
    }
    if(comehomeTime.Kcompare(et.add(gt))){
      comehomeTime = et.add(gt);
    }
    tstr.push(
    <div>
      <div>{tasks[j].name} : {st.print()} ~ {et.print()}</div>
    </div>
    )
  }
  let out = `外出:${outdoorTime.print()}`
  if(outdoorTime.print() == "24:00"){
    out = ""
  }
  let come = `帰宅:${comehomeTime.print()}`
  if(comehomeTime.print() == "0:00"){
    come = ""
  }
  return(
    <div style = {styl.table}>
      <div style = {styl.go}>
        {out}
      </div>
      <div style = {styl.cont}>
      {tstr}
      </div>
      <div style = {styl.come}>
        {come}
      </div>
    </div>
  )
};