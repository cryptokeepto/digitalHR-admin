import { Component, OnInit } from '@angular/core';
import { CertifyLetterService } from "../../../services/certify-letter.service";

declare let $: any;

@Component({
  selector: 'app-certify-letter',
  templateUrl: './certify-letter.component.html',
  styleUrls: ['./certify-letter.component.css']
})
export class CertifyLetterComponent implements OnInit {

  private users: any[];
  private pageTotals: any;
  private pagination: number[] = [];
  private usersChecked: any[] = [];

  constructor(private certifyLetterService: CertifyLetterService) { }

  ngOnInit() {
    this.getCertifyLetterAll();
  }

  private getCertifyLetterAll() {
    this.certifyLetterService.getCertifyLetterAll(1, 5)
      .subscribe(
        (res) => {
          this.users = res.message.data;
          this.pageTotals = res.message.pageTotals;
        },
        (err) => { },
        () => {
          for (let i = 0; i < this.pageTotals; i++) {
            this.pagination.push(i);
          }
        }
      );
  }

  private itemPagination(item: number) {
    this.certifyLetterService.getCertifyLetterAll(item, 5)
      .subscribe(
        (res) => {
          this.users = res.message.data;
        },
        (err) => { },
        () => {
          for (let i = 0; i < $("input:checkbox").length; i++) {
            $("input:checkbox")[i].checked = false;
          }
          // clear value all page
          this.usersChecked = [];
          console.log(this.usersChecked);
        }
      );
  }

  private getDate(): string {
    const d: any = new Date();
    const year: any = d.getFullYear().toString();
    let month: any = d.getMonth() + 1;
    let day: any = d.getDate().toString();
    let hour: any = d.getHours();
    let minute: any = d.getMinutes();
    let second: any = d.getSeconds();
    if (month.toString().length < 2) { month = '0' + month; }
    if (day.length < 2) { day = '0' + day; }
    if (hour.toString().length < 2) { hour = '0' + hour; }
    if (minute.toString().length < 2) { minute = '0' + minute; }
    if (second.toString().length < 2) { second = '0' + second; }
    const result = [year, month, day].join('-') + ' ' + [hour, minute, second].join(':');
    return result;
  }

  private putCertifyLetter(ticketID: string, status: number, modified: string) {
    return new Promise((resolve, reject) => {
      this.certifyLetterService.putCertifyLetter(ticketID, status, modified)
        .subscribe(
          (res) => resolve(res),
          (err) => reject(err),
          () => { }
        );
    })
  }

  private async reject(status: number): Promise<void> {
    const result: boolean = confirm("Reject ?");
    if (result) {
      for (let i = 0; i < this.usersChecked.length; i++) {
        for (let user of this.users) {
          if (this.usersChecked[i].ticketID === user.ticketID) {
            const modified = this.getDate();
            try {
              let data = await this.putCertifyLetter(user.ticketID, status, modified);
              console.log(data);
            } catch (err) {
              throw err;
            }
          }
        }
      }
      // after update
      this.usersChecked = [];
      for (let i = 0; i < $("input:checkbox").length; i++) {
        $("input:checkbox")[i].checked = false;
      }
      console.log("rejected");
      window.location.reload();
    }
  };

  private async complete(status: number): Promise<void> {
    const result: boolean = confirm("Complete ?");
    if (result) {
      for (let i = 0; i < this.usersChecked.length; i++) {
        for (let user of this.users) {
          if (this.usersChecked[i].ticketID === user.ticketID) {
            const modified = this.getDate();
            try {
              let data = await this.putCertifyLetter(user.ticketID, status, modified);
              console.log(data);
            } catch (err) {
              throw err;
            }
          }
        }
      }
      // after update
      this.usersChecked = [];
      for (let i = 0; i < $("input:checkbox").length; i++) {
        $("input:checkbox")[i].checked = false;
      }
      console.log("completed");
      window.location.reload();
    }
  }

  private checkedChange(user, event): void {
    let checked = event.target.checked;
    let userId = user.ticketID;
    if (checked) {
      this.users.forEach((user) => {
        if (user.ticketID === userId) {
          this.usersChecked.push(user);
        }
      });
    } else {
      this.users.forEach((user) => {
        if (user.ticketID === userId) {
          this.usersChecked.splice(this.usersChecked.findIndex((v) => v === userId), 1);
        }
      });
    }
  };

  private checkedAll(event): void {
    // init usersChecked = [];
    this.usersChecked = [];
    let checked = event.target.checked;
    if (checked) {
      // input checked
      for (let i = 1; i < $("input:checkbox").length; i++) {
        $("input:checkbox")[i].checked = true;
      }
      this.users.forEach((user) => {
        this.usersChecked.push(user);
      })
    } else {
      // input not checked
      this.usersChecked = [];
      for (let i = 0; i < $("input:checkbox").length; i++) {
        $("input:checkbox")[i].checked = false;
      }
    }
  };

  private generateWord() {

    // todo last attibute set default value
    // this.usersChecked = [];
  }

  private generateExcel() {

    // this.usersChecked = [];
  }

  private generatePdf() {

    // this.usersChecked = [];

  }

}
