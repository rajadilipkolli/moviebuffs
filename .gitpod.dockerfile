FROM gitpod/workspace-gitpod/workspace-java-17

RUN sudo sysctl -w vm.max_map_count=262144