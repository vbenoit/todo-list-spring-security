package controllers;

import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.*;
import org.springframework.stereotype.*;
import org.springframework.web.bind.annotation.*;

import DTO.ToDoDTO;
import domain.ToDo;
import services.ToDoService;

/**
 * Todos Controller
 */
@Controller
@EnableAutoConfiguration
public class ToDoController {

	private final Logger logger = LoggerFactory.getLogger(ToDoController.class);
	@Autowired @Qualifier("toDoSvc") ToDoService toDoService;
	
	//@CrossOrigin(origins = {"http://localhost:4200", "http://localhost"})
	@CrossOrigin
    @RequestMapping("/")
    @ResponseBody
    String home() {
        return "Todo home!";
    }
	
	@CrossOrigin
    @RequestMapping("/admin")
    @ResponseBody
    String admin() {
		logger.info("this url is reachable by an admin only.");
        return "You're admin!";
    }
    
    /**
     * Get the complete list of todos
     * @param
     * @return the toDoList
     */
	@CrossOrigin
    @RequestMapping("/todos")
    public @ResponseBody List<ToDo> getToDoList() {
        
    	this.logger.info("Get the complete list of todos");
    	
    	return toDoService.getAll();
    }
    
    /**
     * add a todo
     * @param toDo
     * @return the toDoList
     */
    @CrossOrigin
    @RequestMapping(value = "/todos", method = RequestMethod.POST)
    public @ResponseBody List<ToDo> addTodo(@RequestBody Map<String, Object> toDo) {
        
    	ToDoDTO toDoDTO = new ToDoDTO();
    	toDoDTO.setContent(toDo.get("content").toString());
    	toDoDTO.setStatus(toDo.get("status").toString());
    	
    	if (toDoService.isValid(toDoDTO)) {
            toDoService.add(toDoDTO);
            this.logger.info("Add todo");
            return getToDoList();
        }
    	
    	this.logger.error("add todo error");
        return null;
    }
    
    /**
     * delete a todo
     * @param the toDo id
     * @return the toDoList
     */
    @CrossOrigin
    @RequestMapping(value = "/todos/{id}", method = RequestMethod.DELETE)
    public @ResponseBody List<ToDo> deleteTodo(@PathVariable(value="id") Long id) {
        
    	ToDo toDo = toDoService.getTodoById( id );
    	
    	if (toDoService.isValid(toDo)) {
            toDoService.delete(toDo);
            this.logger.info("Delete todo");
            return getToDoList();
        }
    	
    	this.logger.error("delete todo error");
        return null;
    }
    
    /**
     * set todo as completed
     * @param toDo
     * @return the toDoList
     */
    @CrossOrigin
    @RequestMapping(value = "/todos", method = RequestMethod.PUT)
    public @ResponseBody List<ToDo> completedTodo(@RequestBody Map<String, Object> toDoInfo) {
        
    	Long id = Long.valueOf( toDoInfo.get("id").toString() );
    	String status = toDoInfo.get("status").toString();
    	ToDo toDo = toDoService.getTodoById( id );
    	toDo.setStatus( status );
    	
    	if (toDoService.isValid(toDo)) {
            toDoService.update(toDo);
            this.logger.info("Completed todo");
            return getToDoList();
        }
    	
    	this.logger.error("Complete todo error");
        return null;
    }
    
    /**
     * to add an example todo when data source is empty
     */
    @PostConstruct
    public void init() {
    	ToDoDTO exampleToDo = new ToDoDTO();
    	exampleToDo.setContent("Example todo");
    	exampleToDo.setStatus("Pending");
        toDoService.add( exampleToDo );
        this.logger.info("Add example todo");
    }
    
}
