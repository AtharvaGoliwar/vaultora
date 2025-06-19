package session

import (
	"data-vault/redisclient"
	"sync"
)

var (
	connMap = make(map[string]*redisclient.Conn)
	mu      sync.RWMutex
)

func Set(username string, conn *redisclient.Conn) {
	mu.Lock()
	defer mu.Unlock()
	connMap[username] = conn
}

func Get(username string) *redisclient.Conn {
	mu.RLock()
	defer mu.RUnlock()
	return connMap[username]
}
