package handler

import (
	"data-vault/session"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
)

type DeleteRequest struct {
	Key string `json:"key"`
}

func DeleteHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
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

	var req DeleteRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	reply, err := conn.SendCommand("DEL", req.Key)
	if err != nil {
		http.Error(w, "Redis error: "+err.Error(), http.StatusInternalServerError)
		return
	}
	parts := strings.Split(reply, "\r\n")
	if len(parts) > 0 && strings.HasPrefix(parts[0], ":") {
		valStr := strings.TrimPrefix(parts[0], ":")
		valInt, err := strconv.Atoi(valStr)
		if err != nil {
			http.Error(w, "Invalid integer format", http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(map[string]int{"reply": valInt})
		return
	}

	// resp, _ := conn.ReadReply()
	// w.Write([]byte(resp))
}
