FROM gitpod/workspace-java-17

RUN sudo sysctl -w vm.max_map_count=524288