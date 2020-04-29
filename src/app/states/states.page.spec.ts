import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StatesPage } from './states.page';

describe('StatesPage', () => {
  let component: StatesPage;
  let fixture: ComponentFixture<StatesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StatesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
