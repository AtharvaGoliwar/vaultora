package handler

import (
	"data-vault/session"
	"encoding/json"
	"net/http"
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
	if reply == ":0\r\n" {
		w.WriteHeader(http.StatusNoContent)
		json.NewEncoder(w).Encode(map[string]string{"reply": reply})
	}
	// resp, _ := conn.ReadReply()
	// w.Write([]byte(resp))
	json.NewEncoder(w).Encode(map[string]string{"reply": reply})
}
