package handler

import (
	"data-vault/session"
	"encoding/json"
	"fmt"
	"net/http"
)

type ExpireRequest struct {
	Key     string `json:"key"`
	Seconds int    `json:"seconds"`
}

func ExpireHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST method allowed", http.StatusMethodNotAllowed)
		return
	}

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

	var req ExpireRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	if req.Key == "" || req.Seconds <= 0 {
		http.Error(w, "Key and positive seconds required", http.StatusBadRequest)
		return
	}

	reply, err := conn.SendCommand("EXPIRE", req.Key, stringFromInt(req.Seconds))
	if err != nil {
		http.Error(w, "Redis error: "+err.Error(), http.StatusInternalServerError)
		return
	}
	// resp, _ := conn.ReadReply()
	// w.Write([]byte(resp))
	json.NewEncoder(w).Encode(map[string]string{"reply": reply})
}

func stringFromInt(n int) string {
	return fmt.Sprintf("%d", n)
}
