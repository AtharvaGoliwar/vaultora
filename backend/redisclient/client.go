package redisclient

import (
	"bufio"
	"fmt"
	"net"
	"strings"
)

type Conn struct {
	conn   net.Conn
	reader *bufio.Reader
}

func NewConnection() (*Conn, error) {
	c, err := net.Dial("tcp", "localhost:6380")
	if err != nil {
		return nil, err
	}
	return &Conn{
		conn:   c,
		reader: bufio.NewReader(c),
	}, nil
}

func (c *Conn) SendCommand(args ...string) (string, error) {
	var sb strings.Builder
	sb.WriteString(fmt.Sprintf("*%d\r\n", len(args)))
	for _, arg := range args {
		sb.WriteString(fmt.Sprintf("$%d\r\n%s\r\n", len(arg), arg))
	}
	fmt.Println(sb.String())
	_, err := c.conn.Write([]byte(sb.String()))
	if err != nil {
		return "", err
	}

	// Read response
	reply := make([]byte, 4096)
	n, err := c.conn.Read(reply)
	if err != nil {
		return "", err
	}

	return string(reply[:n]), nil
}

// func (c *Conn) ReadReply() (string, error) {
// 	// line, err := c.reader.ReadString('\n')
// 	line, err := c.reader.ReadString()
// 	if err != nil {
// 		return "", err
// 	}
// 	fmt.Println(strings.TrimSpace(line))
// 	return strings.TrimSpace(line), nil
// }

func (c *Conn) Close() error {
	return c.conn.Close()
}

// func (c *Conn) ReadReply() (string, error) {
// 	line, err := c.reader.ReadString('\n')
// 	if err != nil {
// 		return "", err
// 	}

// 	switch line[0] {
// 	case '+', '-', ':': // Simple string, error, or int
// 		return strings.TrimSpace(line[1:]), nil

// 	case '$': // Bulk string
// 		size, _ := strconv.Atoi(strings.TrimSpace(line[1:]))
// 		if size == -1 {
// 			return "", nil // Null bulk string
// 		}
// 		buf := make([]byte, size+2) // read size + \r\n
// 		_, err := io.ReadFull(c.reader, buf)
// 		if err != nil {
// 			return "", err
// 		}
// 		return string(buf[:size]), nil

// 	case '*': // Array
// 		count, _ := strconv.Atoi(strings.TrimSpace(line[1:]))
// 		var result []string
// 		for i := 0; i < count; i++ {
// 			_, _ = c.reader.ReadString('\n')                 // read $len
// 			part, _ := c.reader.ReadString('\n')             // read value
// 			result = append(result, strings.TrimSpace(part)) // strip \r\n
// 		}
// 		return strings.Join(result, ","), nil

// 	default:
// 		return "", fmt.Errorf("unknown reply: %s", line)
// 	}
// }
