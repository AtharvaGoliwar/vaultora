package handler

import (
	"data-vault/redisclient"
	"data-vault/session"
	"encoding/json"
	"fmt"
	"net/http"
)

type AuthRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func RedisAuthHandler(w http.ResponseWriter, r *http.Request) {
	var req AuthRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	conn, err := redisclient.NewConnection()
	if err != nil {
		http.Error(w, "Redis connection failed", http.StatusInternalServerError)
		return
	}

	// Send AUTH
	reply, err := conn.SendCommand("AUTH", req.Username, req.Password)
	if err != nil {
		http.Error(w, "AUTH failed", http.StatusUnauthorized)
		return
	}
	// resp, _ := conn.ReadReply()
	fmt.Println(reply)
	if reply != "+OK\r\n" {
		http.Error(w, "AUTH rejected", http.StatusUnauthorized)
		return
	}

	session.Set(req.Username, conn)

	json.NewEncoder(w).Encode(map[string]string{
		"status": "Authenticated",
	})
}
