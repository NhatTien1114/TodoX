import React, { useState } from "react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Calendar, CheckCircle2, Circle, SquarePen, Trash2 } from "lucide-react";
import { Input } from "./ui/input";
import api from "@/lib/axios";
import { toast } from "sonner";

const TaskCard = ({task, index, handleTaskChanged}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [updateTaskTitle, setUpdateTaskTitle] = useState(task.title || "")

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      toast.error("Bạn đã xóa nhiệm vụ này");
      handleTaskChanged();
    } catch (error) {
      console.error("Lỗi xảy ra khi xóa task.", error);
      toast.error("Lỗi xảy ra khi xóa nhiệm vụ.");
    }
  }

  const updateTask = async () => {
    try {
      setIsEditing(false)
      await api.put(`/tasks/${task._id}`, {
        title: updateTaskTitle
      })
      toast.success(`Nhiệm vụ đã đổi thành ${updateTaskTitle}`)
      handleTaskChanged()
    } catch (error) {
      console.error("Lỗi xảy ra khi cập nhật task.", error);
      toast.error("Lỗi xảy ra khi cập nhật nhiệm vụ.");
    }
  }

  const toggleTaskCompleteButton = async () => {
    try {
      if (task.status === 'active' ) {
        await api.put(`/tasks/${task._id}`, {
          status: "complete",
          completedAt: new Date().toISOString()
      })
      toast.success(`${task.title} đã hoàn thành`)
    } else {
      await api.put(`/tasks/${task._id}`, {
        status: "active",
        completedAt: null
      })
      toast.error(`${task.title} đã đổi sang chưa hoàn thành`)
    }
      handleTaskChanged()
    } catch (error) {
      console.error("Lỗi xảy ra khi cập nhật task.", error);
      toast.error("Lỗi xảy ra khi cập nhật nhiệm vụ.");
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      updateTask();
    }
  }
  return (
    <Card className={cn(
        "p-4 bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-200 animate-fade-in group",
        task.status === 'complete' && 'opacity-75'
    )}
    style={{animationDelay: `${index * 50}ms`}}
    >
        <div className="flex items-center gap-4">
          {/* Nút tròn */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "flex-shrink-0 size-8 rounded-full transition-all duration-200",
              task.status === 'complete' ? 
              'text-success hover:tex-success/80'
               : 'text-muted-foreground hover:text-primary'
            )}
            onClick={toggleTaskCompleteButton}
          >
            {task.status === 'complete' ? (
            <CheckCircle2 className="size-5"/>
            ): (
            <Circle className="size-5"/>  
          )}
          </Button>

          {/* Hiển thị hoặc chỉnh sửa tiêu đề */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <Input
                type="text"
                placeholder="Cần phải làm gì?"
                className="flex-1 h-12 text-base border-border/50 focus:ring-primary/20 focus:border-primary/50"
                value={updateTaskTitle}
                onChange={(e) =>
                  setUpdateTaskTitle(e.target.value)
                }
                onKeyPress={handleKeyPress}
                onBlur={() => {
                  setIsEditing(false);
                  setUpdateTaskTitle(task.title || "")
                }}
              />
            ) : (
              <p className={cn(
                "text-base transition-all duration-200",
                task.status === 'complete' ? "line-through text-muted-foreground" :  "text-foreground"
              )}
              >
                {task.title}
              </p>
            )}
              {/* Ngày tạo và ngày hoàn thành */}
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="size-3 text-muted-foreground"/>
            <span className="text-xs text-muted-foreground">
              {new Date(task.createdAt).toLocaleString()}
            </span>
            {task.completeAt && (
              <>
                <span className="text-xs text-muted-foreground"> - </span>
                <Calendar className="size-3 text-muted-foreground"/>
                <span className="text-xs text-muted-foreground">
                  {new Date(task.completeAt).toLocaleString()}
                </span>
              </>
            )}
          </div>
          </div>

            {/* Nút chỉnh và xóa */}
          <div className="hidden group-hover:inline-flex gap-2 animate-slide-up">
            {/* Nút chỉnh */}
            <Button 
              variant='ghost'
              size='icon'
              className="flex-shrink-0 size-8 transition-colors text-muted-foreground hover:text-info"
              onClick={() => {
                setIsEditing(true)
                setUpdateTaskTitle(task.title || "")
              }}
            >
              <SquarePen className="size-4"/>
            </Button>

            {/* Nút xóa */}
            <Button 
              variant='ghost'
              size='icon'
              className="flex-shrink-0 size-8 transition-colors text-muted-foreground hover:text-destructive"
              onClick={() => deleteTask(task._id)}
            >
              <Trash2 className="size-4"/>
            </Button>
          </div>
        </div>


    </Card>
  );
};   
export default TaskCard;