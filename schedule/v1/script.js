'use strict';

let app = new Vue({
  el: '#app',
  data: {
    group: "in171",
    schedule: null,
    parity: "numerator",
    subGroup: "subGroup2",
    date: null
  },
  methods: {
    getSchedule: function(){
      axios.get(this.group+'.json').then(response => {
        this.schedule = response.data[this.parity][this.subGroup]});
        let params = {"group": this.group, "subGroup": this.subGroup}
        localStorage.setItem('scheduleParams', JSON.stringify(params));
    },
    getWeek: function(){
      let now = new Date;
      let onejan = new Date(now.getFullYear(), 0, 1);
      return Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    }
  },
  watch: {
    subGroup: function () {
      this.getSchedule()
    },
    parity: function(){
      this.getSchedule()
    }
  },
  created: function(){
    let params = JSON.parse(window.localStorage.getItem('scheduleParams'));
    if(params){
      this.group = params.group;
      this.subGroup = params.subGroup;
    }

    if(this.getWeek()%2 === 0){
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

    this.getSchedule()
  }
})
