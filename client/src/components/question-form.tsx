import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import FileUpload from "@/components/ui/file-upload";
import { ImageIcon } from "lucide-react";
import { insertQuestionSchema } from "@shared/schema";
import type { Question, Subject } from "@shared/schema";

const questionFormSchema = insertQuestionSchema.extend({
  options: z.array(z.string()).optional(),
  correctAnswer: z.number().optional(),
});

type QuestionFormData = z.infer<typeof questionFormSchema>;

interface QuestionFormProps {
  question?: Question;
  onSubmit: (data: QuestionFormData, questionImage?: File, optionImages?: (File | null)[]) => void;
  onCancel?: () => void;
}

export default function QuestionForm({ question, onSubmit, onCancel }: QuestionFormProps) {
  const [questionType, setQuestionType] = useState<"multiple-choice" | "descriptive">(
    question?.type as "multiple-choice" | "descriptive" || "multiple-choice"
  );
  const [questionImage, setQuestionImage] = useState<File | null>(null);
  const [optionImages, setOptionImages] = useState<(File | null)[]>([null, null, null, null]);

  // Fetch subjects
  const { data: subjects, isLoading: subjectsLoading } = useQuery<Subject[]>({
    queryKey: ['/api/subjects'],
  });

  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      subjectId: question?.subjectId || 1,
      type: question?.type || "multiple-choice",
      questionText: question?.questionText || "",
      options: question?.options || ["", "", "", ""],
      correctAnswer: question?.correctAnswer || 0,
      points: question?.points || 1,
      createdBy: 1, // Default to instructor user
    },
  });

  const handleSubmit = (data: QuestionFormData) => {
    onSubmit(data, questionImage || undefined, optionImages);
  };

  const handleQuestionTypeChange = (type: "multiple-choice" | "descriptive") => {
    setQuestionType(type);
    form.setValue("type", type);
  };

  const handleOptionImageSelect = (index: number, file: File) => {
    const newImages = [...optionImages];
    newImages[index] = file;
    setOptionImages(newImages);
  };

  const handleOptionImageRemove = (index: number) => {
    const newImages = [...optionImages];
    newImages[index] = null;
    setOptionImages(newImages);
  };

  const options = form.watch("options") || ["", "", "", ""];

  return (
    <Card className="shadow-material">
      <CardHeader>
        <CardTitle>문제 생성</CardTitle>
        <p className="text-sm text-gray-600">문제 은행에 객관식 또는 주관식 문제를 추가하세요</p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Subject Selection */}
            <FormField
              control={form.control}
              name="subjectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>과목</FormLabel>
                  <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="과목을 선택하세요" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subjectsLoading ? (
                        <SelectItem value="loading" disabled>과목 로딩 중...</SelectItem>
                      ) : (
                        subjects?.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id.toString()}>
                            {subject.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Question Type Selection */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">문제 유형</Label>
              <div className="grid grid-cols-2 gap-3">
                <div
                  className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm ${
                    questionType === "multiple-choice"
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-300 bg-white"
                  }`}
                  onClick={() => handleQuestionTypeChange("multiple-choice")}
                >
                  <div className="flex flex-1 flex-col">
                    <span className="block text-sm font-medium text-gray-900">객관식</span>
                    <span className="mt-1 text-sm text-gray-500">4개 선택지</span>
                  </div>
                </div>
                <div
                  className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm ${
                    questionType === "descriptive"
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-300 bg-white"
                  }`}
                  onClick={() => handleQuestionTypeChange("descriptive")}
                >
                  <div className="flex flex-1 flex-col">
                    <span className="block text-sm font-medium text-gray-900">주관식</span>
                    <span className="mt-1 text-sm text-gray-500">서술형</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Question Text */}
            <FormField
              control={form.control}
              name="questionText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>문제</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="문제를 입력하세요..."
                      rows={3}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Question Image Upload */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                문제 이미지 (선택사항)
              </Label>
              <FileUpload
                onFileSelect={setQuestionImage}
                onFileRemove={() => setQuestionImage(null)}
                currentImageUrl={question?.questionImage || undefined}
              />
            </div>

            {/* Points */}
            <FormField
              control={form.control}
              name="points"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>배점</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="1"
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Multiple Choice Options */}
            {questionType === "multiple-choice" && (
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">답안 선택지</Label>
                <FormField
                  control={form.control}
                  name="correctAnswer"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          value={field.value?.toString()}
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          className="space-y-3"
                        >
                          {[0, 1, 2, 3].map((index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <RadioGroupItem value={index.toString()} />
                              <Input
                                placeholder={`선택지 ${String.fromCharCode(65 + index)}`}
                                value={options[index]}
                                onChange={(e) => {
                                  const newOptions = [...options];
                                  newOptions[index] = e.target.value;
                                  form.setValue("options", newOptions);
                                }}
                                className="flex-1"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  // Handle option image upload
                                }}
                              >
                                <ImageIcon className="h-4 w-4 text-gray-400" />
                              </Button>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <p className="text-xs text-gray-500 mt-2">정답을 선택하세요</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                  취소
                </Button>
              )}
              <Button type="submit" className="flex-1">
                {question ? "문제 수정" : "문제 추가"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
