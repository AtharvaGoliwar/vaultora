package handler

import (
	"data-vault/session"
	"encoding/json"
	"net/http"
	"strings"
)

func MeHandler(w http.ResponseWriter, r *http.Request) {
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

	reply, err := conn.SendCommand("ME")
	if err != nil {
		http.Error(w, "Redis error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Manual RESP array parsing
	lines := strings.Split(strings.TrimSpace(reply), "\r\n")
	if len(lines) < 4 || lines[0] != "*2" {
		http.Error(w, "Unexpected ME response format", http.StatusInternalServerError)
		return
	}

	resp := map[string]string{
		"username": lines[2],
		"group":    lines[4],
	}
	// w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
	// resp, _ := conn.ReadReply()
	// w.Write([]byte(resp))
	// w.Write([]byte(reply))
	// json.NewEncoder(w).Encode(map[string]string{"value": reply})
}
