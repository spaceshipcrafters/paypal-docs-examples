#!/bin/sh

# Show ps
CMD="docker compose ps --format 'table {{.Name}}\t{{.Image}}\t{{.Health}}\t{{.RunningFor}}\t{{.Ports}}'"
tmux split-window -vb -p 50 watch -n 1 $CMD

# Select prompt pane
tmux select-pane -t -1