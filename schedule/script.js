'use strict';

let app = new Vue({
  el: '#app',
  data: {
    group: "in171",         //номер группы
    schedule: null,         //объект с расписанием
    parity: "numerator",    //числитель или знаменатель
    subGroup: "subGroup2",  //номер подгруппы
    date: null,             //день недели и число
    timing: null,           //расписание звонков
    minutes: [],            //расписание звонков в минутах
    timer: ''               //время до конца/начала пары
  },
  methods: {
    getSchedule: function(){
      axios.get(this.group+'.json').then(response => {
        this.schedule = response.data[this.parity][this.subGroup]
        this.timing = response.data['timing'];
        this.redirect();
      });
        let params = {"group": this.group, "subGroup": this.subGroup}
        localStorage.setItem('scheduleParams', JSON.stringify(params));

    },
    getWeek: function(){
      let now = new Date;
      let onejan = new Date(now.getFullYear(), 0, 1);
      return Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    },
    getMinutes: function(){
      let timers = this.timing['monday'].join(',').split(',');
      let minutes = [];

      timers.forEach(function(item){
        let t = item.split(':')
        minutes.push(parseInt(t[0])*60+parseInt(t[1]))
      })
      this.minutes = minutes
    },
    getNumClass: function(){
      if(this.minutes.length < 2){
        this.getMinutes.call(this);
      }
      let now = new Date();

      let minutes = now.getHours()*60 + now.getMinutes();
      let array = [0].concat(this.minutes);
      let n = array[0]-minutes
      let num = -1;


      for(let i = 0; i < array.length-1; i++){
        if(minutes >= array[i] & minutes < array[i+1]){
          num = i;
          n = array[i+1]-minutes
        }

      }
      if(num > -1){this.timer = ['До начала ','До конца '][num%2]+' '+((num-num%2)/2+1)+'-ой пары '+n+' мин.'}
      else{this.timer = 'Пары закончились'}
    },
    redirect: function(){
      let weekday = new Date().toLocaleString('en', {
		    weekday: 'long'
      });
      window.location.replace('#'+weekday.toLowerCase());
    }
  },
  watch: {
    subGroup: function () {
      this.getSchedule()
    },
    parity: function(){
      this.getSchedule()
    },
    group: function(){
      this.getSchedule()
    }
  },
  created: function(){
    let params = JSON.parse(window.localStorage.getItem('scheduleParams'));
    if(params){
      this.group = params.group;
      this.subGroup = params.subGroup;
    }

    if(this.getWeek()%2 === 1){
      this.parity = 'denominator';
    }
    else{
      this.parity = 'numerator';
    }

    this.date = new Date().toLocaleString('ru', {
		    weekday: 'long',
        month: 'numeric',
        day: 'numeric'
      });

    this.getSchedule();

    setInterval(function(){
      this.getNumClass.call(this);
    }.bind(this),500);


  }
})
