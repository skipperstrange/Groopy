import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockedlistPage } from './blockedlist.page';

describe('BlockedlistPage', () => {
  let component: BlockedlistPage;
  let fixture: ComponentFixture<BlockedlistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockedlistPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockedlistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
