import { TestBed } from '@angular/core/testing';

import { ContextConsumerService } from './context-consumer.service';

describe('ContextConsumerService', () => {
  let service: ContextConsumerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContextConsumerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
