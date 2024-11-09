#!/usr/bin/env bash
#   Use this script to test if a given TCP host/port are available

TIMEOUT=15
QUIET=0
WAIT_HOST=""
WAIT_PORT=""

echoerr() { if [[ $QUIET -ne 1 ]]; then echo "$@" 1>&2; fi }

usage()
{
    cat << USAGE >&2
Usage:
    $0 host:port [-t timeout] [-- command args]
    -q | --quiet                        Do not output any status messages
    -t TIMEOUT | --timeout=timeout      Timeout in seconds, zero for no timeout
    -- COMMAND ARGS                     Execute command with args after the test finishes
USAGE
    exit 1
}

wait_for()
{
    if [[ $TIMEOUT -gt 0 ]]; then
        echoerr "$0: waiting $TIMEOUT seconds for $WAIT_HOST:$WAIT_PORT"
    else
        echoerr "$0: waiting for $WAIT_HOST:$WAIT_PORT without a timeout"
    fi
    start_ts=$(date +%s)
    while :
    do
        if [[ $WAIT_PORT =~ ^[0-9]+$ ]]; then
            nc -z "$WAIT_HOST" "$WAIT_PORT" > /dev/null 2>&1
        else
            curl --output /dev/null --silent --head --fail "$WAIT_HOST" > /dev/null 2>&1
        fi
        result=$?
        if [[ $result -eq 0 ]]; then
            end_ts=$(date +%s)
            echoerr "$0: $WAIT_HOST:$WAIT_PORT is available after $((end_ts - start_ts)) seconds"
            break
        fi
        sleep 1
    done
    return $result
}

wait_for_wrapper()
{
    # In order to support SIGINT during timeout: http://unix.stackexchange.com/a/57692
    if [[ $QUIET -eq 1 ]]; then
        timeout $TIMEOUT $0 $WAIT_HOST:$WAIT_PORT --quiet -- "$@" &
    else
        timeout $TIMEOUT $0 $WAIT_HOST:$WAIT_PORT -- "$@" &
    fi
    pid=$!
    trap "kill -INT -$pid" INT
    wait $pid
}

while [[ $# -gt 0 ]]
do
    case "$1" in
        *:* )
        WAIT_HOST=$(printf "%s\n" "$1"| cut -d : -f 1)
        WAIT_PORT=$(printf "%s\n" "$1"| cut -d : -f 2)
        shift 1
        ;;
        -q | --quiet)
        QUIET=1
        shift 1
        ;;
        -t)
        TIMEOUT="$2"
        if [[ $TIMEOUT = "" ]]; then break; fi
        shift 2
        ;;
        --timeout=*)
        TIMEOUT="${1#*=}"
        shift 1
        ;;
        --)
        shift
        break
        ;;
        --help)
        usage
        ;;
        *)
        echoerr "Unknown argument: $1"
        usage
        ;;
    esac
done

if [[ "$WAIT_HOST" = "" || "$WAIT_PORT" = "" ]]; then
    echoerr "Error: you need to provide a host and port to test."
    usage
fi

wait_for_wrapper "$@"
