## Server-Sent Event

A Node.js implementation of Server-Sent Event pattern.


### Publish

      POST /events
      
      Payload: { "id": { the event id }, "data": { some data } }

### Subscribe

      GET /events/{event_id}

### Consumers info
      
      GET /consumers
