"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Message, User } from "@/model/User";
import { acceptMessSchema } from "@/schemas/acceptMessSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessSchema),
  });

  const { register, setValue, watch } = form;

  const acceptMessages = watch("acceptMessages");

  const onDeleteMessage = (messageId: string) => {
    const updatedMessages = messages.filter(
      (message) => message._id !== messageId
    );

    setMessages(updatedMessages);
  };

  const fetchAcceptMessages = useCallback(async () => {
    // for handling switch
    setIsSwitchLoading(true);

    try {
      const res = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", res.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message || "Error fetching accept messages",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue,toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(true);
      try {
        const res = await axios.get<ApiResponse>(`/api/get-messages`);
        setMessages(res.data.messages || []);
        if (refresh) {
          toast({
            title: "Refreshed Messages",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message || "Error fetching messages",
          variant: "destructive",
        });
      } finally {
        setIsSwitchLoading(false);
        setIsLoading(false);
      }
    },
    [setMessages, setIsLoading,toast]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [
    setValue,
    session,
    fetchAcceptMessages,
    fetchMessages,
    toast,
    setMessages,
  ]);

  const handleSwitchChange = async () => {
    try {
      const res = await axios.post<ApiResponse>(`/api/accept-messages`, {
        acceptMessages: !acceptMessages,
      });

      setValue("acceptMessages", !acceptMessages);
      toast({
        title: "Message acceptance status updated successfully",
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message || "Error handling switch change",
        variant: "destructive",
      });
    }
  };

  if (!session || !session.user)
    return (
      <div className="flex text-center items-center justify-center text-2xl p-10">
        Please Login
      </div>
    );

  const { username } = session.user as User;

  const baseURL = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseURL}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL Copied!",
      description: "Profile URL has been copied to clipboard.",
    });
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>

      {/* ADDED SKELETON */}

      {isLoading ? (
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard
                key={message._id as string}
                message={message}
                onMessageDelete={onDeleteMessage}
              />
            ))
          ) : (
            <p className="text-lg font-semibold p-5">No messages to display.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
