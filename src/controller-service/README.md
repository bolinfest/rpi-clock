# controller-service

gRPC service that contains the business logic for updating the 7-segment
display while also making it possible for clients to subscribe to those updates.
Ideally, this would be part of the `segment7-service`, but unfortunately,
Python gRPC services are handicapped when it comes to supporting streams:
https://github.com/grpc/grpc/issues/7910.
