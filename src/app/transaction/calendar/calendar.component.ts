import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal.module';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent
} from 'angular-calendar';
import { EngineService } from '../../services/engine.service';
import { CookieService } from '../../../../node_modules/ngx-cookie';


const colors: any = {
  high: {
    primary: '#3700B3',
    secondary: '#eae5fc'
  },
  medium: {
    primary: '#6200EE',
    secondary: '#eae5fc'
  },
  low: {
    primary: '#893ff0',
    secondary: '#eae5fc'
  }
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {


  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  view = 'month';
  url: string;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-reply"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-link"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Open', event);
      }
    },
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];
  activeDayIsOpen = true;

  constructor(private modal: NgbModal, private engineService: EngineService, private _cookieService: CookieService) { }

  ngOnInit(): void {
    this.url = 'Lead/GetMyAlerts/' + this._cookieService.get('Oid');
    this.engineService.getData(this.url).toPromise().then(res => {
      // console.log(res);
      let colorData = colors.high;
      res.forEach(element => {
        if (element.Priority === 'High') {
          colorData = colors.high;
        } else if (element.Priority === 'Medium') {
          colorData = colors.medium;
        } else if (element.Priority === 'Low') {
          colorData = colors.low;
        }
        this.events.push({
          start: new Date(element.AlertDate),
          end: new Date(element.AlertDate),
          title: '<strong>' + element.LeadNo + ':</strong> ' + element.Subject + ' - <i>\"' + element.Remarks + '\"</i>',
          color: colorData,
          draggable: false,
          resizable: {
            beforeStart: false,
            afterEnd: false
          }
        });
      });
      this.refresh.next();
      // console.log('event', this.events);
    }).catch(err => {
      console.log(err);
    }
    );
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    // this.modalData = { event, action };
    // console.log(this.modalData);
    // this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events.push({
      title: 'New event',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    });
    this.refresh.next();
    console.log('event-2', this.events);
  }
}
