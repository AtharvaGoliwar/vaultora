package handler

import (
	"data-vault/session"
	"encoding/json"
	"net/http"
	"strings"
)

func KeysHandler(w http.ResponseWriter, r *http.Request) {
	username := r.Header.Get("Username")
	if username == "" {
		http.Error(w, "Missing username", http.StatusBadRequest)
		return
	}

	conn := session.Get(username)
	if conn == nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	reply, err := conn.SendCommand("KEYS", "*")
	if err != nil {
		http.Error(w, "Redis error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Parse RESP manually
	lines := strings.Split(reply, "\r\n")
	var keys []string
	for i := 0; i < len(lines); i++ {
		if strings.HasPrefix(lines[i], "$") && i+1 < len(lines) {
			keys = append(keys, lines[i+1])
			i++ // skip next line (already added)
		}
	}

	json.NewEncoder(w).Encode(map[string][]string{
		"keys": keys,
	})
}
