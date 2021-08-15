#!/bin/bash

cd /opt/titansystem/
case $1 in

  start)
    cd /opt/titansystem/
    if [ -f ".screenlock" ]; then
        echo "The bot is already running!"
    else
        touch .screenlock
        screen -dmS titansystem bash loop.sh
        echo "Started the bot!"
    fi
    ;;

  stop)
    if [ -f ".screenlock" ]; then
        rm -rf .screenlock
        screen -S titansystem -X "quit"
        echo "Stopped the bot!"
    else
        echo "The bot is not running!"
    fi
    ;;

  restart)
    if [ -f ".screenlock" ]; then
        screen -S titansystem -X "quit"
        screen -dmS titansystem bash loop.sh
        echo "Restarted the bot!"
    else
        echo "The bot is not running!"
    fi
    ;;

  watch)
    if [ -f ".screenlock" ]; then
      screen -x titansystem
    else
      echo "The bot is not running!"
    fi 
    ;;

  *)
    echo "Usage: $0 <start / stop / restart / watch>"
    ;;
esac
